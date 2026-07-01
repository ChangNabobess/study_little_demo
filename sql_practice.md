# SQL 练习题（基于本项目真实表结构 · T-SQL / SQL Server）

> 面向：有前端经验、系统学 SQL 的同学。
> 数据库：SQL Server（语法用 T-SQL）。
> 用法：每题先自己写 SQL，再展开「参考答案与考点」自查。由易到难，循序渐进。
> 表结构取自项目实体：`src/AdiconDataService.Core/BaseData/` 下的 `pf_dict_companies.cs`、`pf_result_report.cs`，以及 `CommonHelper.Create_log_login` 写入的 `log_login` 表。

---

## 📋 数据字典（3 张表）

### 1. `dbo.log_login` —— 登录日志表
| 字段 | 类型 | 含义 |
|---|---|---|
| `Id` | bigint | 主键（雪花ID）|
| `datatype` | int | 日志类型（1=登录相关）|
| `operators` | varchar | 操作账号（登录名）|
| `operatorname` | varchar | 操作人姓名 |
| `remark` | varchar | 结果备注，如「登录成功」/「登录失败:用户名或密码无效!!!」|
| `createtime` | datetime | 发生时间 |

### 2. `dbo.pf_dict_companies` —— 机构表（医院/客户/子公司）
| 字段 | 类型 | 含义 |
|---|---|---|
| `customerid` | varchar | 单位ID（**关联键**）|
| `customername` | varchar | 单位名称 |
| `statusflag` | varchar | 客户状态：`'0'`签约 `'1'`潜在 `'2'`暂停 `'9'`停止 |
| `labcode` | varchar | 所属子公司/项目库代码 |
| `Accessflag` | int (可空) | 平台接入状态：0未接入 1正常 2上传 3下载 |
| `sendcheckstatus` | smallint (可空) | 送检状态：0休眠 1正常 |
| `updatetime` | datetime (可空) | 最后修改时间 |

### 3. `dbo.pf_result_report` —— 检测报告主表
| 字段 | 类型 | 含义 |
|---|---|---|
| `reportid` | bigint | 报告ID |
| `reqcompid` | varchar | 送检单位ID（**→ 关联 `pf_dict_companies.customerid`**）|
| `execompid` | varchar | 执行单位ID |
| `reporttype` | int (可空) | 报告类型：1临检 2微生物 3病理 4其他 |
| `isvalid` | int (可空) | 是否有效：1有效 0无效 |
| `exechangestatus` | int (可空) | 下载状态：0未下载 1已下载 |
| `uploadtime` | datetime (可空) | 上传时间 |
| `reporttime` | datetime (可空) | 报告时间 |

> 关联主线：一个机构（`pf_dict_companies`）送检产生多份报告（`pf_result_report`），通过 `reqcompid = customerid` 关联（一对多）。

---

## 第一部分：单表查询（WHERE / ORDER BY / TOP）

### 第 1 题 · WHERE + ORDER BY
从 `pf_dict_companies` 查出所有**签约客户**（`statusflag='0'`）的 **单位ID、单位名称、最后修改时间** 三列，按**最后修改时间从新到旧**排序。

- 只返回这 3 列，不要 `SELECT *`；
- 注意 `statusflag` 是字符串类型，条件值该怎么写。

<details><summary>参考答案与考点</summary>

```sql
SELECT customerid, customername, updatetime
FROM dbo.pf_dict_companies
WHERE statusflag = '0'
ORDER BY updatetime DESC;
```

**考点：**
- `statusflag` 是 varchar，条件值必须加单引号 `'0'`；写成 `= 0` 虽然 SQL Server 会隐式转换，但是坏习惯，且会破坏索引。
- `ORDER BY ... DESC` 降序；升序是 `ASC`（默认，可省略）。
- 显式列出列名，不用 `SELECT *`——生产代码的基本规范。
- ⚠️ `updatetime` 可空，值为 NULL 的行排序时默认排在最前（SQL Server 把 NULL 当最小值，DESC 时排最后）。
</details>

---

### 第 2 题 · 多条件 AND + IN
从 `pf_dict_companies` 查出**已正常或上传接入**（`Accessflag` 是 1 或 2）**且**送检状态为正常（`sendcheckstatus=1`）的机构的 **单位ID、单位名称、接入状态**，按单位名称升序。

- 用 `IN` 表达「1 或 2」；
- 体会多个条件用 `AND` 连接。

<details><summary>参考答案与考点</summary>

```sql
SELECT customerid, customername, Accessflag
FROM dbo.pf_dict_companies
WHERE Accessflag IN (1, 2)
  AND sendcheckstatus = 1
ORDER BY customername ASC;
```

**考点：**
- `IN (1,2)` 等价于 `Accessflag = 1 OR Accessflag = 2`，更简洁。
- `Accessflag` 是 int，这里条件值不加引号（与第 1 题对照，类型决定写法）。
- 多条件组合：`AND` 优先级高于 `OR`，混用时要加括号，本题全是 AND 不涉及。
- `Accessflag`、`sendcheckstatus` 都可空，NULL 不会满足 `IN`/`=` 条件（NULL 比较结果是 unknown），会被自动排除——这点和直觉一致，但要心里有数。
</details>

---

### 第 3 题 · 日期范围 + LIKE + TOP
从 `log_login` 查出**最近 7 天内**、备注里**包含「失败」二字**的登录日志，取**最新的 20 条**，返回 **操作账号、姓名、备注、发生时间**，按时间倒序。

- 「最近 7 天」用 T-SQL 的日期函数表达，别写死日期；
- 「包含失败」用模糊匹配；
- 「最新 20 条」用 SQL Server 特有的写法。

<details><summary>参考答案与考点</summary>

```sql
SELECT TOP (20) operators, operatorname, remark, createtime
FROM dbo.log_login
WHERE createtime >= DATEADD(DAY, -7, GETDATE())
  AND remark LIKE '%失败%'
ORDER BY createtime DESC;
```

**考点：**
- **`TOP (N)`** 是 SQL Server 取前 N 行的语法（MySQL 用 `LIMIT`，Oracle 用 `ROWNUM`/`FETCH`）。括号是推荐写法。
- `TOP` 必须配合 `ORDER BY` 才有确定含义，否则「前 20 条」是随机的。
- **`DATEADD(DAY, -7, GETDATE())`**：在当前时间上加 -7 天。`GETDATE()` 取服务器当前时间。
- **`LIKE '%失败%'`**：`%` 是通配符（任意长度任意字符），`%失败%` = 任意位置包含「失败」。`_` 匹配单个字符。
- 进阶：`LIKE '%x%'` 前导 `%` 会导致索引失效（全表扫描），数据量大时是性能隐患——了解即可，本题不展开。
</details>

---

## 第二部分：聚合查询（GROUP BY / COUNT / SUM / HAVING）

### 第 4 题 · GROUP BY + COUNT
统计 `pf_result_report` 中**每种报告类型**（`reporttype`）各有多少份报告，返回 **报告类型、报告数量** 两列，按数量从多到少排序。

<details><summary>参考答案与考点</summary>

```sql
SELECT reporttype, COUNT(*) AS report_count
FROM dbo.pf_result_report
GROUP BY reporttype
ORDER BY report_count DESC;
```

**考点：**
- `GROUP BY reporttype`：按报告类型分组，每组聚合成一行。
- `COUNT(*)` 数每组的行数；`AS report_count` 给计算列起别名。
- **铁律**：`SELECT` 里出现的非聚合列，必须出现在 `GROUP BY` 里。这里选了 `reporttype`，所以它必须 group by。
- `ORDER BY` 里可以直接用别名 `report_count`（SQL Server 支持），因为 ORDER BY 在逻辑上最后执行。
- `reporttype` 可空，NULL 会单独成一组（聚合时 NULL 自成一类，和 WHERE 里的行为不同）。
</details>

---

### 第 5 题 · GROUP BY + HAVING
找出**送检报告数超过 100 份**的送检单位（`reqcompid`），返回 **送检单位ID、报告数**，按报告数降序。

- 体会 `HAVING` 和 `WHERE` 的区别：过滤的是「分组后的结果」。

<details><summary>参考答案与考点</summary>

```sql
SELECT reqcompid, COUNT(*) AS report_count
FROM dbo.pf_result_report
GROUP BY reqcompid
HAVING COUNT(*) > 100
ORDER BY report_count DESC;
```

**考点（核心）：**
- **`WHERE` vs `HAVING`**：
  - `WHERE` 在分组**前**过滤原始行（不能用聚合函数）；
  - `HAVING` 在分组**后**过滤分组（可以用聚合函数 `COUNT/SUM`）。
- 本题「报告数 > 100」是对分组结果的过滤，必须用 `HAVING`，不能写在 `WHERE`。
- `HAVING` 里不能用别名 `report_count`，要重写 `COUNT(*)`（因为 HAVING 在 SELECT 别名生效之前执行）——这是和 ORDER BY 的关键区别。
- 执行顺序记忆：`FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY`。
</details>

---

### 第 6 题 · 条件聚合（SUM + CASE / 过滤聚合）
按送检单位（`reqcompid`）统计每个单位的：**报告总数、有效报告数（`isvalid=1`）、无效报告数（`isvalid=0`）**，三列放在同一行输出。

- 这题要在一次 `GROUP BY` 里同时算出「总数」和「按条件分别计数」，用 `SUM(CASE WHEN ...)` 技巧。

<details><summary>参考答案与考点</summary>

```sql
SELECT
    reqcompid,
    COUNT(*) AS total_count,
    SUM(CASE WHEN isvalid = 1 THEN 1 ELSE 0 END) AS valid_count,
    SUM(CASE WHEN isvalid = 0 THEN 1 ELSE 0 END) AS invalid_count
FROM dbo.pf_result_report
GROUP BY reqcompid;
```

**考点：**
- **条件聚合**：`SUM(CASE WHEN 条件 THEN 1 ELSE 0 END)` 是把「符合条件的行记 1，否则记 0」再求和，等价于「满足条件的行数」。这是把「行级条件」塞进聚合的经典手法。
- 为什么不用 `WHERE isvalid=1`？因为那样会把无效报告整行过滤掉，没法在同一行同时给出有效/无效两个数。
- 等价写法：`COUNT(CASE WHEN isvalid=1 THEN 1 END)`（COUNT 不计 NULL，所以 ELSE 可省）。
- `CASE WHEN ... THEN ... ELSE ... END` 是 T-SQL 的条件表达式，类似 JS 的三元/switch。
</details>

---

### 第 7 题 · 日志统计（COUNT + 过滤 + HAVING）
从 `log_login` 统计**每个账号的登录失败次数**（备注含「失败」），只保留**失败 ≥ 3 次**的账号，返回 **账号、失败次数**，按失败次数降序。

<details><summary>参考答案与考点</summary>

```sql
SELECT operators, COUNT(*) AS fail_count
FROM dbo.log_login
WHERE remark LIKE '%失败%'
GROUP BY operators
HAVING COUNT(*) >= 3
ORDER BY fail_count DESC;
```

**考点：**
- `WHERE` 先筛出失败记录（行级过滤），`GROUP BY` 按账号分组，`HAVING` 再筛分组——`WHERE` + `HAVING` 协作的典型场景。
- 这条 SQL 有实际意义：可用于识别疑似暴力破解/异常登录的账号。
- 思考：如果要「统计每个账号的成功率」，怎么写？（提示：`SUM(CASE WHEN remark LIKE '%成功%' THEN 1 ELSE 0 END) * 1.0 / COUNT(*)`，注意 `*1.0` 避免整数除法。）
</details>

---

## 第三部分：多表 JOIN（INNER / LEFT 区别）

### 第 8 题 · INNER JOIN
查出每份报告对应的**送检单位名称**。返回 **报告ID、送检单位ID、送检单位名称、报告类型**，只要能匹配到机构的报告。

- `pf_result_report.reqcompid = pf_dict_companies.customerid` 关联。

<details><summary>参考答案与考点</summary>

```sql
SELECT
    r.reportid,
    r.reqcompid,
    c.customername,
    r.reporttype
FROM dbo.pf_result_report AS r
INNER JOIN dbo.pf_dict_companies AS c
    ON r.reqcompid = c.customerid;
```

**考点：**
- **表别名**：`r`、`c` 让多表查询简洁；两表有同名列时（如都可能有 remark）必须用 `表名.列名` 限定。
- `INNER JOIN` 只返回**两边都能匹配上**的行：`reqcompid` 在机构表里找不到对应 `customerid` 的报告会被丢弃；没有任何报告的机构也不出现。
- `ON` 是连接条件，别和 `WHERE` 混淆（`ON` 决定怎么连，`WHERE` 决定连完后留哪些）。
</details>

---

### 第 9 题 · LEFT JOIN（找「没有报告」的机构）
找出**从未产生过任何送检报告**的机构，返回 **单位ID、单位名称**。

- 这题是 `LEFT JOIN` 的经典用法：保留左表全部机构，匹配不到报告的就是答案。

<details><summary>参考答案与考点</summary>

```sql
SELECT c.customerid, c.customername
FROM dbo.pf_dict_companies AS c
LEFT JOIN dbo.pf_result_report AS r
    ON c.customerid = r.reqcompid
WHERE r.reportid IS NULL;
```

**考点（INNER vs LEFT 的关键）：**
- `LEFT JOIN` 保留**左表（机构）所有行**，右表（报告）匹配不上的，右表列全部填 `NULL`。
- 所以「右表主键 `r.reportid IS NULL`」就精准锁定了「没有任何报告的机构」——这是「反向查找/找缺失」的标准套路。
- 对比第 8 题：`INNER JOIN` 会让这些没报告的机构直接消失，根本查不到。
- ⚠️ 易错：过滤条件 `r.reportid IS NULL` 必须写在 `WHERE`。如果写到 `ON` 里，含义完全不同（不会过滤左表行）。
- 也能用子查询实现（见第 10 题的 `NOT IN`/`NOT EXISTS`），但 `LEFT JOIN ... IS NULL` 通常更直观。
</details>

---

## 第四部分：子查询

### 第 10 题 · 子查询（IN / NOT IN）
用**子查询**方式，查出**至少有一份有效报告**（`isvalid=1`）的机构的 **单位ID、单位名称**。

- 先在子查询里选出「有有效报告的送检单位ID集合」，外层再用 `IN` 过滤机构表。

<details><summary>参考答案与考点</summary>

```sql
SELECT customerid, customername
FROM dbo.pf_dict_companies
WHERE customerid IN (
    SELECT reqcompid
    FROM dbo.pf_result_report
    WHERE isvalid = 1
);
```

**考点：**
- **子查询（subquery）**：括号里的 `SELECT` 先执行，产出一列 `reqcompid` 集合，外层 `IN` 拿它当过滤条件。
- 这种「子查询返回一列、外层 IN 匹配」叫**非相关子查询**（子查询不依赖外层），效率通常不错。
- ⚠️ **`NOT IN` 的大坑**：如果子查询结果里**含 NULL**，`NOT IN` 会整体返回空结果（因为 `x NOT IN (1,2,NULL)` 永远是 unknown）。所以做「反向查找」优先用 `NOT EXISTS` 或第 9 题的 `LEFT JOIN ... IS NULL`。
- 对比 `JOIN`：本题也能用 `INNER JOIN + DISTINCT` 实现，但「只判断存在性、不需要右表的列」时，子查询/`EXISTS` 语义更清晰。
</details>

---

### 第 11 题 · 相关子查询 / 聚合子查询（高于平均）
找出**送检报告数高于「所有机构平均报告数」**的送检单位，返回 **送检单位ID、报告数**，按报告数降序。

- 需要先算出「每个单位的报告数」，再和「平均报告数」比较。
- 可以用「子查询嵌套聚合」实现。

<details><summary>参考答案与考点</summary>

```sql
-- 写法 A：派生表（子查询当临时表）
SELECT reqcompid, report_count
FROM (
    SELECT reqcompid, COUNT(*) AS report_count
    FROM dbo.pf_result_report
    GROUP BY reqcompid
) AS t
WHERE t.report_count > (
    SELECT AVG(cnt * 1.0)
    FROM (
        SELECT COUNT(*) AS cnt
        FROM dbo.pf_result_report
        GROUP BY reqcompid
    ) AS x
)
ORDER BY report_count DESC;
```

**考点：**
- **派生表（derived table）**：`FROM (SELECT ...) AS t`——把一个子查询的结果当成临时表来查，必须起别名 `AS t`。
- 先 `GROUP BY` 算出每个单位的报告数，外层再和平均值比较——「两级聚合」。
- `AVG(cnt * 1.0)`：`* 1.0` 把 int 转成小数，避免**整数除法**（`7/2` 在 SQL Server 里是 3 不是 3.5），这是 T-SQL 常见陷阱。
- 进阶（学完窗口函数后）：本题用 `AVG(...) OVER ()` 窗口函数会更优雅，一遍扫描即可——可作为后续目标。
</details>

---

### 第 12 题 · 综合（JOIN + 聚合 + 子查询/排序）
出一份「机构送检概览」：返回**每个机构的 单位名称、客户状态、总报告数、有效报告数**，只统计**今年以来**（`uploadtime` 在本年内）的报告，且**只保留总报告数 ≥ 50** 的机构，按总报告数降序，取**前 10 名**。

- 综合考察：`JOIN` + 日期过滤 + `GROUP BY` + 条件聚合 + `HAVING` + `TOP` + `ORDER BY`。

<details><summary>参考答案与考点</summary>

```sql
SELECT TOP (10)
    c.customername,
    c.statusflag,
    COUNT(*) AS total_count,
    SUM(CASE WHEN r.isvalid = 1 THEN 1 ELSE 0 END) AS valid_count
FROM dbo.pf_result_report AS r
INNER JOIN dbo.pf_dict_companies AS c
    ON r.reqcompid = c.customerid
WHERE r.uploadtime >= DATEFROMPARTS(YEAR(GETDATE()), 1, 1)
GROUP BY c.customername, c.statusflag
HAVING COUNT(*) >= 50
ORDER BY total_count DESC;
```

**考点（综合）：**
- **执行顺序串起来**：`FROM/JOIN`（连表）→ `WHERE`（按时间筛行）→ `GROUP BY`（按机构分组）→ `HAVING`（筛分组）→ `SELECT`（算聚合列）→ `ORDER BY` → `TOP`。
- `GROUP BY` 里要带上所有非聚合的 SELECT 列（`customername`、`statusflag`）。
- 「今年以来」：`DATEFROMPARTS(YEAR(GETDATE()),1,1)` 拼出「今年 1 月 1 日」；也可写 `YEAR(r.uploadtime) = YEAR(GETDATE())`，但后者对 `uploadtime` 用了函数会导致索引失效，前者写法更利于走索引。
- `TOP (10)` + `ORDER BY` 取排行榜前 10。
- 体会：真实报表 SQL 基本都是这种「多表 + 分组 + 条件聚合 + 排行」的组合拳。
</details>

---

## 附：T-SQL 速查（练习中常用）

| 需求 | T-SQL 写法 |
|---|---|
| 取前 N 行 | `SELECT TOP (N) ...`（配 `ORDER BY`）|
| 当前时间 | `GETDATE()` |
| 日期加减 | `DATEADD(DAY, -7, GETDATE())` |
| 日期差 | `DATEDIFF(DAY, a, b)` |
| 取年/月/日 | `YEAR(d)` / `MONTH(d)` / `DAY(d)` |
| 模糊匹配 | `LIKE '%kw%'`（`%`任意串，`_`单字符）|
| 处理 NULL | `ISNULL(col, 0)` / `COALESCE(a,b,c)` |
| 判空 | `col IS NULL` / `col IS NOT NULL`（不能 `= NULL`）|
| 条件表达式 | `CASE WHEN cond THEN x ELSE y END` |
| 去重计数 | `COUNT(DISTINCT col)` |
| 避免整数除法 | `a * 1.0 / b` 或 `CAST(a AS decimal)/b` |
| 字符串拼接 | `a + b`（含 NULL 会变 NULL，注意）|

> 执行顺序（牢记）：`FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → TOP`
