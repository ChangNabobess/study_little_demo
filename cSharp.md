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
