### 1017

#### c# 小知识点

- 1、C# DBHelper 类 （数据库帮助类）
- 2、C# \_db.Queryable<table_name>(); 支持链式调用

```c#
/*
  1、通常出现在使用 ORM 框架（对象关系映射）的上下文中，尤其是 SqlSugar 框架;
  2、[ORM](https://www.cnblogs.com/Can-daydayup/p/15911410.html#_label1) 是 Object Relational Mapping 的缩写，译为“对象关系映射”，是一种程序设计技术，用于实现面向对象编程语言里不同类型系统的数据之间的转换;
  3、SqlSugar 是一个流行的 C# ORM 框架，支持多种数据库，使用简单，且性能较好;
  4、_db 是 SqlSugarClient 的实例，通过它可以对数据库进行查询、插入、更新、删除等操作;
 */
  var list = _db.Queryable<User>()
              .Where(u => u.Age > 18)  // 查询年龄大于18的用户
              .OrderBy(u => u.Name)     // 按照名字排序
              .ToList();                // 执行查询并返回结果列表

  _db：通常是一个 SqlSugarClient 的实例，表示数据库上下文。
  Queryable<User>()：表示对 User 表进行查询。
  User 是一个映射到数据库表的实体类。
  Where(u =>u.Age > 18)：筛选条件，类似于 SQL 中的 WHERE 子句。
  OrderBy(u =>u.Name)：排序，类似于 SQL 中的 ORDER BY 子句。
  ToList()：执行查询并将结果转换为一个列表。
```

### 1024

- C# 类
  类定义多个方法，方法实现类

### 1028

- 1、 C# (JsonConverter 类)[https://learn.microsoft.com/zh-cn/dotnet/api/system.text.json.serialization.jsonconverter?view=net-8.0]
  将对象或值转换为 JSON，或是从 JSON 转换为对象或值。

```c#
using Newtonsoft.Json;

// 假设你有一个 JSON 字符串
string jsonString = "{\"Name\":\"John\", \"Age\":30}";

// 定义一个类来映射 JSON 数据
public class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
}

// 使用 DeserializeObject 方法将 JSON 字符串转换为 Person 对象
Person person = JsonConvert.DeserializeObject<Person>(jsonString);

// 现在你可以使用 person 对象了
Console.WriteLine(person.Name); // 输出: John
Console.WriteLine(person.Age);  // 输出: 30

```

- 2、数据传输对象 (DTO)[https://learn.microsoft.com/zh-cn/aspnet/web-api/overview/data/using-web-api-with-entity-framework/part-5]
  (CSDN 详解 DTO)[https://blog.csdn.net/fishandfishand/article/details/139601403]

DTO 是一种类型定义类，数据传输对象，属于一种设计模式，使用的时候可以直接 new 一个新对象出来使用；
优点：
1、减少表节点过多暴漏在客户端，用什么拿什么就行-隐藏实体对象的细节；
2、方便使用，在多个方法之间传递参数时候，像 InterFace 一样规范化-解耦合-DTO 可以将实体对象与业务逻辑层解耦，是系统更加灵活；
3、减少网络通信的次数和数据量(这一点是记住的，没有见过)-减少网络通信；

- 3、Extent 数据扩展

- 4、Trick Or Treat (不给糖就捣蛋)

### 1112

#### 1、c#中 DynamicParameters 的使用

DynamicParameters 是 Dapper 库中的一个类，用于在执行 SQL 查询时动态地传递参数。Dapper 是一个轻量级的 ORM（对象关系映射）框架，通过 DynamicParameters，可以在运行时方便地添加、删除或更新参数，从而实现灵活的 SQL 查询参数化。

> 应用示例

```csharp
/*
  基本查询语句 WHERE 1=1 这是一个常用技巧，用于方便动态拼接多个条件，避免处理第一个 AND 的情况
  WHERE 1=1 这种写法实际目的是为了获取逻辑值"True"，主要用于动态拼接SQL、查询表结构
*/
var sqlSelect = "SELECT * FROM Dictionary WHERE 1=1";
// 如果 dictcode 或 dictname 字段包含 @dictname 的值，就返回结果
sqlSelect += " and (dictcode like @dictname or dictname like @dictname)";
var parameters = new DynamicParameters();
// @dictname 参数：添加了 %，实现 LIKE 查询的模糊匹配功能。
parameters.Add("@dictname", "%" + searchValue + "%");

using (var connection = new SqlConnection(connectionString))
{
    var result = connection.Query(sqlSelect, parameters);
}

```

#### 2、c# 参数修饰符 [out](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/method-parameters#out-parameter-modifier)

在方法中返回指定关键字的值。在参数声明中添加 out 关键字，在对应方法中需要单独赋值给需要返回的关键字；
**需要注意，以下限制适用于使用 out 关键字：**
2.1、异步方法中不允许使用 out 参数。
2.2、迭代器方法中不允许使用 out 参数。
2.3、属性不能作为 out 参数传递。

#### 3、.NET 8 方法[tryparse](https://learn.microsoft.com/zh-cn/dotnet/api/system.int32.tryparse?view=net-8.0)

> 3.1 方法定义

```csharp
/*
  s
  String
  要分析的字符串。

  provider
  IFormatProvider
  一个对象，提供有关 s的区域性特定格式设置信息。

  result
  Int32
  此方法返回时，包含成功分析 s 或失败时未定义的值的结果。
*/
public static bool TryParse (string? s, IFormatProvider? provider, out int result);
```

> 3.2 方法示例

```csharp
using System;

public class Example
{
   public static void Main()
   {
      string[] values = { null, "160519", "9432.0", "16,667",
                          "   -322   ", "+4302", "(100);", "01FA" };
      foreach (var value in values)
      {
         int number;

         bool success = int.TryParse(value, out number);
         if (success)
         {
            Console.WriteLine($"Converted '{value}' to {number}.");
         }
         else
         {
            Console.WriteLine($"Attempted conversion of '{value ?? "<null>"}' failed.");
         }
      }
   }
}
// The example displays the following output:
//       Attempted conversion of '<null>' failed.
//       Converted '160519' to 160519.
//       Attempted conversion of '9432.0' failed.
//       Attempted conversion of '16,667' failed.
//       Converted '   -322   ' to -322.
//       Converted '+4302' to 4302.
//       Attempted conversion of '(100);' failed.
//       Attempted conversion of '01FA' failed.
```

#### 、SQL 语句学习

> .1 SELECT

```sql
/*
  小知识点1：
  ctrl + k + c 添加注释
  ctrl + k + u 取消注释
*/
SELECT * FROM table_name;
SELECT column1,column2 FROM table_name;
SELECT DISTINCT column1,column2 FROM table_name; // 去重筛选列表项
```

### 1113

#### 1、SqlServe 窗口函数 (ROW_NUMBER())[https://learn.microsoft.com/en-us/sql/t-sql/functions/row-number-transact-sql?view=sql-server-ver16]

- 1.1、语法
<!--
  理解1：PARTITION: 分割、分离；
  理解2：给查询的表数据增加行号；
  理解3：支持分组、排序，增加行号的功能；
-->

```sql
ROW_NUMBER ( )
    OVER ( [ PARTITION BY value_expression , ... [ n ] ] order_by_clause )
```

- 1.2、练习

```sql
-- 筛选表 TEST_TABLE_NAME 中 age !== 0; 的数据，并且按照 Salary 字段降序排列，并且增加行号；
create table TEST_TABLE_NAME(
  id int Null,
  name varchar(50),
  age int null,
  sex varchar(2),
  salary demil(10, 2)
)
insert into TEST_TABLE_NAME values(1, 'zhangsan', 18, '男', 1234.23 );
insert into TEST_TABLE_NAME values(2, 'lisi', 19, '女', 3432.34 );
insert into TEST_TABLE_NAME values(3, 'wangwu', 0, '男', 7893.54 );
insert into TEST_TABLE_NAME values(4, 'zhaoliu', 20, '女', 2387.63 );
insert into TEST_TABLE_NAME values(5, 'liubei', 3, '男', 8297.94 );
insert into TEST_TABLE_NAME values(6, 'guanyu', 58, '女', 1325.76 );
insert into TEST_TABLE_NAME values(7, 'zhangfei', 26, '男', 5657.44 );
insert into TEST_TABLE_NAME values(8, 'xiaojie', 67, '男', 3965.85 );
insert into TEST_TABLE_NAME values(9, 'xiaoli', 10, '女', 7854.36 );
insert into TEST_TABLE_NAME values(10, 'xiaozhang', 23, '男', 5760.45 );

SELECT [name],[age],[salary], ROW_NUMBER() OVER(order by salary DESC)
 From TEST_TABLE_NAME WHERE age <> 0;
```

#### 2、sql 语句练习(demo-数据对接测试库)

```sql
--查询1001实验室暂停合作的所有客户，按照客户ID降序
select * From [DataServicePlatFormDB].[dbo].[pf_dict_companies] where labcode = '1001' and statusflag = 2 order by customerid ASC;
```

### 1116

#### c# 速成指南 B 站视频学习笔记-DAY1-基础结构

- 1、csharp 项目入口文件 main 函数基础结构

```csharp
using System;
namespace CMS
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello Word");
        }
    }
}
```

- 2、什么是方法

```csharp
  // 方法示例，实战代码在 D:\Work\myself\ConsoleTestApp
  <Access Specifier><Modifier><Return Type><Method Name>(Params List)
  {
    Methods Body
  }
  // ============================Access Specifier访问修饰符 6个
  public // 公共方法，随便调用
  private // 私有方法，其他Class不能调用
  protected // 受保护方法，只能在当前类、派生类中调用
  private protected // 组合效果
  internal // 内部方法，同一个程序集中的所有类可以调用
  protected internal // 组合效果

  // ============================Modifier声明修饰符 8个
  static // 静态
  abstract // 抽象
  virtual // 许派生类重写的虚函数
  override // 允许方法继承后重写
  new // 可以隐藏基类成员
  sealed // 表示不能被继承
  partial // 允许在同一个程序集分散定义
  extern // 用于声明外部实现的extern
```

- 3、c#代码注释、反注释、格式化快捷键**和数据库的注释方法好像一样**

```csharp
ctrl + k + c // 代码格式化
ctrl + k + u // 代码取消注释
ctrl + k + d // 格式化代码
```

### 1117

#### c# 速成指南 B 站视频学习笔记-DAY2-function 传参

- 1、值传参、引用传参、输出传参

```csharp
using System;
namespace transferExam{
  class transferExamClass{
    public static void main(string[] args){
      int x = 1, y = 2;
      refswap(ref x, ref y);
      Console.WriteLine($"x={x},y={y}");
      outputSwap(out x, out y);
      Console.WriteLine($"x={x},y={y}");
    }
    // 引用传参
    static void refswap(ref int x,ref int y) {
      int temp = x;
      x = y;
      y = temp;
    }
    // 输出传参
    static void outputSwap(out int x,out int y){
      x = 10;
      y = 15;
    }
  }
}
```

- 2、c# [基础数据类型](https://www.runoob.com/csharp/csharp-data-types.html)

### 0107

#### c#小知识

1. ConcurrentDictionary 此集合类是一个线程安全实现;
2. IConfigurationRoot 接口;
3. ConfigurationBuilder;

### 0108

#### .core 后缀文件夹主要作用是项目底层机制相关代码

### 0115

#### [DataTable 类](https://learn.microsoft.com/zh-cn/dotnet/api/system.data.datatable?view=netframework-4.8.1)

- 表示内存中数据的一个表。

### 0515

> c#文件后缀名定义使用

- .cs: c#源文件；
- .dll: 动态链接库；
- .exe: 可执行文件；
- .pdb: 程序调试数据库文件；
- .config: 配置文件；
- .resx: 语言资源文件；
- .resw: 语言资源文件；
- .resjson: 语言资源文件；

| 后缀                                 | 通常职责                                                | 举例                                 |
| ------------------------------------ | ------------------------------------------------------- | ------------------------------------ |
| `Application`                        | 应用层，处理业务用例，协调 `Domain` 与 `Infrastructure` | DTO、Service、Command、Query 等      |
| `Core` 或 `Domain`                   | 核心业务模型层，定义实体类、业务接口、领域服务、事件等  | 实体类、接口、业务规则               |
| `Infrastructure` 或 `DatabaseAccess` | 基础设施层，负责数据库、缓存、第三方服务等              | EF Core、Redis、HTTP 等实现          |
| `Migrator`                           | 数据迁移、建表等初始化逻辑                              | `DbContext.Database.Migrate()`、脚本 |
| `WebApi` 或 `Host`                   | 应用的启动入口，API 控制器、配置、日志等                | Program.cs、Startup.cs、Controllers  |
| `Quartz`                             | 定时任务模块（Quartz.NET 是常用库）                     | 任务调度 Job、调度器配置等           |
| `Tests`                              | 单元测试或集成测试                                      | NUnit、xUnit、Moq 等                 |

> DLL 动态数据库连接

### 0522

```c#
/*
  Task 表示 “正在执行或尚未开始执行的操作”，它最终会产生一个结果（或者什么都不返回），你可以等待它完成。
      同步转异步，不阻塞线程，支持高并发。约等于Promise；
  [FromBody]	参数 model 从 HTTP 请求的 Body 中提取（通常是 JSON）；
      将 HTTP 请求的正文（Body）反序列化为参数对象，是Asp.core.Mvc 中的一个特性；
      JSON是序列化的对象，[FormBody]可以将Post请求体中的参数根据AuthenticateModel映射反序列化为AuthenticateModel对象；
  AuthenticateModel model	一个自定义的类对象，用于接收请求体中的用户名密码等登录信息；
*/
// TODO 一下方法的定义实现是.NET框架的模型绑定(Model Binding)、模型验证(Model Validation)机制实现的
public async Task<AuthenticateResultModel> Authenticate([FromBody] AuthenticateModel model){}
```

### 0529

> linq、Dapper、EF 框架的区别
> | 名称 | 类型 | 说明 |
> | ------------------------- | --------- | ------------------------------------------- |
> | **EF (Entity Framework)** | ORM 框架 | 提供完整的数据访问功能（自动建表、查询、跟踪更改等） |
> | **Dapper** | 微型 ORM 框架 | 更轻量、更快、更接近手写 SQL，但也能自动映射实体 |
> | **LINQ** | 语言特性 | 一种统一查询语法，EF 能直接用 LINQ 查询，Dapper 不支持 LINQ 查询 |

> 功能比对
> | 特性/能力 | Entity Framework | Dapper | LINQ |
> | ------------- | --------------------- | --------------- | ---------------- |
> | 类型 | 全功能 ORM | 微型 ORM | 查询语言特性（不是 ORM） |
> | 查询方式 | 支持 LINQ 和 SQL | 只支持 SQL（支持参数化） | 可用于对象集合/EF 查询 |
> | 自动建表/迁移 | ✅ 支持 Code First | ❌ 不支持 | ❌ 不支持 |
> | 复杂 SQL 操作（多表联查） | 不灵活，需手动编写 SQL | 非常灵活 | ❌ 不适合 |
> | 性能 | 中等 | 很快，接近手写 ADO.NET | 性能取决于底层实现 |
> | 适合场景 | 快速开发、复杂对象管理 | 高性能、可控性强、轻量服务 | 查询集合、EF 查询、内存过滤等 |
> | 数据追踪 | 支持自动追踪（ChangeTracker） | 不支持 | 不涉及 |

### 26-01-09

### ABP 框架中的 DI（Dependency Injection）容器自动注入构造函数需要的对象；

```c#
/*
  这个_logInManager是由 ABP + ASP.NET Core 的依赖注入（DI）容器自动创建并传进来的。
  Controller = Web 后端里“接收请求、协调处理、返回结果”的入口层
  base() = super() = 父类构造函数
  :base(repository) 表示「把 repository 往上传给父类的构造函数」，相当于 JS 的 super(repository)。

  override = 重写父类方法。父类 AsyncCrudAppService 本来有个默认的 GetAllAsync，这里用自己的实现（Dapper 手写 SQL + 递归建树）覆盖它。
 */
namespace RBAC.Controllers
{
    [Route("api/[controller]/[action]")]
    public class TokenAuthController : RBACControllerBase
  {
    private readonly LogInManager _logInManager;
    public TokenAuthController(LogInManager logInManager) :base(repository)
    {
        _logInManager = logInManager;
    }
    public async override Task<PagedResultDto<Sys_MenuDto>> GetAllAsync(...)
    {
      var list = await dbConnection.QueryAsync<Sys_MenuDto>(sql);
      ...
    }
  }
}
```

### 26-06-16

#### 名词解释

1. 装饰器
2. 构造函数（依赖注入）
3. 子类继承父类，<泛型定义>
4. DTO
   > DTO = Data Transfer Object(数据传输对象)。它的职责是在「后端 ↔ 前端」之间传数据。≈ 你接口文档里的 request/response TypeScript interface。
5. 实体类
   > Entity(实体类) = 数据库表的映射。它的职责是在「后端 ↔ 数据库」之间传数据。

<span style="color:yellow; font-weight:600;">Entity = 数据库长什么样;DTO = 给前端看什么样。两者职责不同,中间用 AutoMapper 转换。</span>

#### EF Core + Dapper 定义解释

> 它们都叫 ORM(Object-Relational Mapping,对象关系映射)——作用是让你用 C# 对象的方式读写数据库,而不是手动处理一行行的数据库记录。

<span style="color:yellow; font-weight:600;">EF Core / Dapper = 帮你把 C# 对象和数据库互转的工具(ORM),一个全自动一个手写 SQL。</span>

#### EF Core + Dapper 使用范围

> |          | EF Core(全功能 ORM)                       | Dapper(微型 ORM)                                       |
> | -------- | ----------------------------------------- | ------------------------------------------------------ |
> | 你写什么 | 写 C# 表达式,它自动生成 SQL               | 你自己写 SQL 字符串,它只帮你把结果映射成对象           |
> | 类比     | Prisma / TypeORM(全自动)                  | 一个「fetch + 自动 JSON.parse 成带类型的对象」的小工具 |
> | 优点     | 不用写 SQL、自动迁移建表、自动追踪变更    | 快、SQL 完全可控、复杂查询灵活                         |
> | 缺点     | 复杂查询时生成的 SQL 可能低效、有「魔法」 | 要手写 SQL、容易写出注入漏洞(上节说的拼接)             |

它俩都是 **.NET 生态专属**的,只能在 .NET 平台上跑——也就是 **C# / F# / VB.NET** 这几门「跑在 .NET 运行时上的语言」。Java、PHP **用不了**它们。

原因和前端是一样的:库是绑定**语言运行时**的。就像 `axios` 是 npm 包,只能在 JS/TS 里用,你没法在 Python 里 `import axios`——你得用 Python 自己的 `requests`。EF Core / Dapper 是 NuGet 包(.NET 的 npm),自然只在 .NET 里用。

不过**「ORM」这个概念是通用的**,每门后端语言都有自己的同类工具。横向对照一下,你一看就懂:

| 语言/平台     | 全功能 ORM(≈EF Core)        | 轻量/手写 SQL(≈Dapper) |
| ------------- | --------------------------- | ---------------------- |
| **.NET (C#)** | EF Core                     | Dapper                 |
| **Java**      | Hibernate / JPA             | MyBatis                |
| **PHP**       | Doctrine、Eloquent(Laravel) | PDO(更偏原生)          |
| **Node.js**   | Prisma、TypeORM             | Knex.js                |
| **Python**    | SQLAlchemy、Django ORM      | —                      |
| **Go**        | GORM                        | sqlx                   |

> 所以你换语言时,**思路能直接迁移,只是换个包名**。比如你哪天写 Java,「EF Core ≈ Hibernate,Dapper ≈ MyBatis」,心智模型不用重学。

一个容易混的点顺便点一下:

- **EF Core / Dapper** = 库(工具),绑语言。
- **SQL** = 语言(标准),跟编程语言无关。不管你用 EF Core、Hibernate 还是 Prisma,它们最终生成/执行的都是 SQL,而 SQL 由**数据库**(SQL Server、MySQL...)来解析。

换句话说:**ORM 工具换一门语言就得换;但底下的 SQL 和数据库是共通的。** 这也是为什么后端常说「SQL 是值得一辈子投资的技能」,而 ORM 工具只是各语言的「方言封装」。

### 26-06-23

#### ASP.NET Core 请求生命周期与框架运行机制

```markdown
# 🚀 全栈进阶笔记：ASP.NET Core 请求生命周期与框架运行机制

作为前端开发者转型全栈，可以将后端框架理解为一个**“将 HTTP 请求（Request）安全、高效地加工成响应（Response）的流水线”**。

在 C# (ASP.NET Core) 的世界里，一个请求从发出到返回，会经历以下标准的核心关卡：

---

## 一、 ASP.NET Core 请求处理流水线 (The Request Pipeline)
```

[前端 HTTP 请求]
│
▼
┌────────────────────────────────────────────────────────┐
│ 1. Kestrel Web 服务器 (二进制字节流解析、分配线程池线程) │
└───────────────────────┬────────────────────────────────┘
│
▼
┌────────────────────────────────────────────────────────┐
│ 2. 中间件管道 (Middleware Pipeline) │
│ - 跨域处理 (CORS) │
│ - 身份验证与授权 (Auth) │
└───────────────────────┬────────────────────────────────┘
│
▼
┌────────────────────────────────────────────────────────┐
│ 3. 端点路由分拣 (Endpoint Routing) │
│ - 匹配 URL 路由表，决定分发给哪个 Controller │
└───────────────────────┬────────────────────────────────┘
│
▼
┌────────────────────────────────────────────────────────┐
│ 4. 控制器上下文 (Controller Action Invocation) │
│ - 模型绑定与验证 (Model Binding & Validation) │
│ - 过滤器 (Action Filters) │
└───────────────────────┬────────────────────────────────┘
│
▼
┌────────────────────────────────────────────────────────┐
│ 5. 业务核心层 (Service & Repository) │
│ - 执行核心业务逻辑 │
│ - 【事务介入】操作数据库 (Unit of Work / EF Core) │
└───────────────────────┬────────────────────────────────┘
│
▼
┌────────────────────────────────────────────────────────┐
│ 6. 响应序列化与原路返回 (Response Serialization) │
│ - 对象转为 JSON 字符串，反向穿过中间件返回给前端 │
└────────────────────────────────────────────────────────┘

````

### 🧱 核心关卡详解

#### 1. Kestrel Web 服务器 —— 【大楼传达室】
* **底层动作**：Kestrel 是 .NET 极高性能的底层 Web 服务器。请求到达时，它负责把网络上的原始**二进制字节流**解析成 C# 认识的 `HttpContext` 对象（包含 `Request` 和 `Response`）。
* **线程介入**：此时，Kestrel 会立刻从系统的**线程池（Thread Pool）**中抓取一个处于待命状态的工作线程，将这个请求全权绑定给它。

#### 2. 中间件管道 (Middleware) —— 【机场安检】
* **底层动作**：ASP.NET Core 采用经典的 **管道模式（Pipeline）**。请求像流水一样顺次穿过一个个中间件（Middleware）。
* **常见职责**：
  * **CORS 中间件**：检查前端域名是否允许跨域。
  * **Authentication/Authorization 中间件**：检查请求头里带的 JWT Token 是否合法？如果没有登录，直接在这一步“熔断”，当场返回 `401 Unauthorized`，请求根本不会到达你的业务代码。
* **前端类比**：非常类似于 Axios 的请求拦截器，或者前端路由守卫（`router.beforeEach`）。

#### 3. 端点路由 (Endpoint Routing) —— 【分拣员】
* **底层动作**：路由中间件会解析请求的 URL 和 HTTP Method（例如 `GET /api/v1/goods/5`），对比你在代码里写的路由特性（如 `[HttpGet("{id}")]`），精准计算出这个请求应该由哪一个 `Controller` 中的哪一个方法（Action）来执行。

#### 4. 模型绑定与校验 (Model Binding & Validation) —— 【翻译官与质检员】
* **底层动作**：
  * **模型绑定**：前端传过来的是一段 JSON 字符串，框架会自动运用反序列化技术，将这段 JSON **翻译并映射** 为 C# 的强类型对象（Class/DTO）。
  * **模型校验**：利用 C# 的特性（Attributes），如果你在实体类的字段上加了 `[Required]` 或 `[Range(18, 100)]`，框架会自动校验。一旦不合法，主线程直接卡死报错，返回 `400 Bad Request`，无需你在代码里写一堆 `if`。

#### 5. 控制器与业务核心层 —— 【主厨炒菜与数据库事务】
* **底层动作**：请求终于来到了你写的 `Controller` 和 `Service`。
* **事务介入**：当业务涉及“扣减余额 $\rightarrow$ 生成订单”等需要保证**原子性**的操作时，代码会通过 **Entity Framework Core (EF Core)** 开启数据库事务。
  ```csharp
  // C# 显式控制事务伪代码
  using var transaction = await _context.Database.BeginTransactionAsync();
  try {
      // 1. 扣减余额
      // 2. 生成订单
      await _context.SaveChangesAsync();
      await transaction.CommitAsync(); // 👈 成功则提交事务，数据落盘
  } catch (Exception) {
      await transaction.RollbackAsync(); // 👈 失败则全部回滚，保证数据安全
  }

````

#### 6. 响应序列化与原路返回 —— 【打包出货】

- **底层动作**：业务执行完后，你的方法通常会返回一个 C# 的对象或 List。框架的最后一环（`System.Text.Json`）负责把这个对象**序列化**为 JSON 字符串，将其写入 `HttpResponse.Body`，然后原路**反向**穿过所有中间件，最后由 Kestrel 服务器通过 Socket 写回给前端。

---

## 二、 C# 框架的底层灵魂：IoC（控制反转）与 DI（依赖注入）

在看 C# Demo 时，你会发现你基本**不需要自己去 `new` 一个类**。这是因为 ASP.NET Core 内置了强大的 **IoC 容器**。

### 1. 传统开发（无 DI） vs 现代开发（有 DI）

- **传统思维**：如果 `UserController` 需要调用 `UserService`，必须在构造函数里写 `_userService = new UserService();`。这导致类与类之间高度耦合，一旦 `UserService` 的构造函数多了一个参数，所有 new 它的地方全部报错。
- **DI 思想**：把创建对象的控制权，上交给框架（控制反转）。

### 2. ASP.NET Core 的具体实现

在 C# 项目的启动文件（通常是 `Program.cs`）中，你会看到很多 `builder.Services.AddScoped...` 的代码，这就是在**向大仓库（IoC 容器）注册服务**：

```csharp
// Program.cs
// 告诉框架：以后谁要使用 IUserService 接口，你就自动 new 一个 UserService 给它
builder.Services.AddScoped<IUserService, UserService>();

```

当请求进来，框架在实例化 `UserController` 时，发现它的构造函数需要 `IUserService`：

```csharp
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    // 👈 构造函数注入：你不用管谁 new 的，框架在运行时会自动从大仓库里拿出来塞给这个参数
    public UserController(IUserService userService)
    {
        _userService = userService;
    }
}

```

### 🌟 前端视角类比

你可以把 .NET Core 的 **IoC 容器** 理解为一个超大型的、由框架自动管理的 **全局状态机（类似于组件层面的全局 Pinia / Redux Store）**。只不过前端 Store 里面存的是**数据**，而后端 IoC 容器里面存的是**一个个活的、可以调用方法的对象实例**。

```

***

**💡 给你一个看 Demo 时的调试小建议：**
你可以在 C# 的 Controller 方法里、以及自定义的 Middleware 处各自打一个**断点（Breakpoint）**，然后用 Postman 发个请求。你会肉眼可见地看到调试光标**先停在中间件、再停在模型验证、最后才进到你的业务方法**。

既然你正在看 C# 的 Demo，有没有看到 `Task`、`async` 和 `await` 相关的异步代码？C# 的异步基于 **TAP（基于任务的异步模式）**，其底层调度跟 Node.js 的单线程事件循环有非常大的区别（C# 的 `await` 之后可能会换到另一个线程执行）。如果看到了这块，不理解的话随时可以发出来我们继续拆解！

```

## 0625

- **事务（Transaction）= 一组要么全部成功、要么全部不做的数据库操作，被当成「一个不可分割的整体」来执行。**

## 一个经典例子：转账

A 给 B 转 100 块，数据库要做两件事：

```sql
UPDATE 账户 SET 余额 = 余额 - 100 WHERE 用户 = 'A';   -- ①扣A的钱
UPDATE 账户 SET 余额 = 余额 + 100 WHERE 用户 = 'B';   -- ②加B的钱
```

如果 ① 执行完，机器突然崩了，② 没执行 → A 少了 100，B 没收到，钱凭空消失。

事务就是用来防止这种「做一半」的：把 ①② 包成一个事务，**要么两条都成功（COMMIT），要么一条都不算（ROLLBACK）**，绝不会停在中间。

```sql
BEGIN TRANSACTION;
  UPDATE 账户 SET 余额 = 余额 - 100 WHERE 用户 = 'A';
  UPDATE 账户 SET 余额 = 余额 + 100 WHERE 用户 = 'B';
COMMIT;   -- 两条都 OK，一起生效；中途出错就 ROLLBACK 全部撤销
```

## 三个关键动作

| 命令                | 作用                                               |
| ------------------- | -------------------------------------------------- |
| `BEGIN TRANSACTION` | 开始一个事务，后面的改动先「挂起」，不立即最终生效 |
| `COMMIT`            | 提交，所有改动一次性正式落库，别人能查到           |
| `ROLLBACK`          | 回滚，撤销本事务里的所有改动，等于没发生过         |

## 事务的四个特性（ACID，了解即可）

- **原子性(A)**：一组操作不可分割，全成或全败 —— 就是上面转账的例子。
- **一致性(C)**：事务前后数据符合规则（转账前后总额不变）。
- **隔离性(I)**：多个事务并发时互不干扰 —— 这就是上一个问题里「**没 COMMIT 别人查不到**」的原因。
- **持久性(D)**：一旦 COMMIT，数据永久保存，断电也不丢。

## 0701
### SSMS中快捷键积累
| 需求 | VS Code 习惯 | SSMS 快捷键 |
|------|------------|------------|
| **批量替换文本** | `Ctrl + H` | `Ctrl + H`（一样）。可勾选正则、区分大小写；选中一段后能限定"仅在选定内容中"替换 |
| **列编辑 / 多行同一列同时输入** | `Alt + 拖动` | **`Alt + 鼠标拖动`** 竖着框选，或 `Shift + Alt + ↑/↓/←/→`,然后直接打字 → 每行同位置同时插入 |
| **在多行行首/行尾批量加东西** | 多光标 | `Alt` 拖出一条**零宽竖线**（框选但不选中字符）→ 打字即在每行插入 |
| **查找** | `Ctrl + F` | `Ctrl + F`（一样） |
| **整词/全部替换** | 替换框里点 | `Ctrl + H` 后按 `Alt + A` = 全部替换 |

## 最常用的一招：列编辑

比如你想给连续几行**行首都加 `--` 注释掉**：
1. 把光标放到第一行行首
2. 按住 **`Alt`**，鼠标往下拖到最后一行行首（拖出一条竖线，跨了 N 行但没选中字符）
3. 直接输入 `--` → N 行同时被加上

> 注释代码其实还有更快的：选中多行后 `Ctrl + K, Ctrl + C` 注释、`Ctrl + K, Ctrl + U` 取消注释。

### visual studio 快捷键积累
VS 2022 的导航后退是 **`Ctrl + -`**，前进 **`Ctrl + Shift + -`**（连续按可退多步，也可以点工具栏左上角那两个蓝色箭头）。

给你一份看 C# 代码最常用的导航快捷键：

| 快捷键 | 作用 | 说明 |
|--------|------|------|
| `F12` | 转到定义 | 接口方法会停在接口声明 |
| `Ctrl + F12` | 转到实现 | 你已经用过，跳到真正的方法体 |
| `Ctrl + -` / `Ctrl + Shift + -` | 后退 / 前进 | 跨文件的光标位置历史 |
| `Shift + F12` | 查找所有引用 | 看这个方法/字段被谁调用了，排查链路必备 |
| `Alt + F12` | 速览定义（Peek） | 在当前文件**弹小窗**看定义，不跳走、不丢上下文 |
| `Ctrl + T` | 全局搜索 | 按类名/方法名/文件名跳转，类似前端的全局 Go to |
| `Ctrl + ,` | 转到成员/符号 | 比 `Ctrl+T` 更轻量的导航 |
| `Ctrl + K, Ctrl + T` | 查看调用层次 | 树状展开"谁调用了它、它调用了谁" |

对你现在看 ABP 这种"接口/实现分离"的代码，最高频的组合是：`Ctrl+F12` 进实现 → 看完 `Ctrl+-` 退回 → `Shift+F12` 看还有谁在用。

> 小提示：如果你的快捷键和上面对不上，可能是装了 ReSharper/Rider 键位方案。`工具 → 选项 → 环境 → 键盘` 里能查到当前实际绑定。
