### 0114 安装 java、配置 jdk 环境、java 及相关环境介绍

1. 下载[oracle jdk](https://www.oracle.com/technetwork/java/javase/downloads/index.html);
2. 下载[idea](https://www.jetbrains.com/idea/download/?section=windows);
3. 配置环境变量
   3.1. CLASSPATH (.;%Java_Home%\bin;%Java_Home%\lib\dt.jar;%Java_Home%\lib\tools.jar;)
   3.2. JAVA_HOME (jdk 安装路径，bin 目录上一级)
   3.3. PATH (变量值前面增加%Java_Home%\bin;%Java_Home%\jre\bin;)
4. java 是 oracle 公司维护的，隔段时间会定期更新版本，并始终保持向下兼容;
5. IDEA、jdk 等集成开发环境是辅助 Java 语言衍生的工具，由 JetBrains 公司开发的;

### 0116

1. **JSR 规范**：Java Specification Request，JSR 规范, 定义好接口；
2. **JCP 组织**：Java Community Process, 负责审核 JSR 的组织；
3. **JDK**：Java Development Kit, 运行编译 java 脚本语言的环境(编译器、调试器等开发工具), 包含 Compiler, debugger, etc., JRE ；
4. **JRE**：Java Runtime Environment, 运行 java 代码的虚拟机, 包含 JVM + Runtime Library；
5. **JVM**：内存模型；

- 补充知识点：JAVA 之父是 James Gosling；

### 0117

1. **[【IDEA】idea 设置默认 maven 配置, 避免每次设置 maven](https://blog.51cto.com/u_16108342/10304913?articleABtest=0)**

2. 访问修饰符，声明修饰
   public private proceted
   static abstract new

```java
public class Test{
   public static void main(String[] args){
      System.out.println("Hello Word")
   }
}
```

3. 基础数据类型
   **测试简陋型表格**
   | 功能 | java | javaScript |
   | -------- | ------------------- | ---------- |
   | 整型 | byte short int long | |
   | 浮点型 | float double | |
   | 布尔类型 | Boolean | |
   | 字符型 | Char | |
   | 引用类型 | String | |
   | 常量 | final | |
   | 其他 | Var 关键字 | |

**测试完整型表格**

<table>
	<tr>
	    <td>数据类型</td>
	    <td>Java</td>
	    <td>JavaScript</td>  
	</tr>
   <tr>
	    <td>整型</td>
	    <td>byte short int long</td>
       <td rowspan="7">
         Null 
         Undefined 
         Boolean 
         Number 
         String 
         Symbol 
         BigInt
       </td>
	</tr>
   <tr>
	    <td>浮点型</td>
	    <td>float double</td>
	</tr>
   <tr>
	    <td>布尔类型</td>
	    <td>Boolean</td>
	</tr>
   <tr>
	    <td>字符型</td>
	    <td>char</td>
	</tr>
   <tr>
	    <td>引用类型</td>
	    <td>String</td>
	</tr>
   <tr>
	    <td>常量</td>
	    <td>final</td>
	</tr>
   <tr>
	    <td>其他</td>
	    <td>Var</td>
	</tr>
</table>

### 0120

```java
/*
   2的8次方是256
   计算机的最小存储单位是byte，从00000000~111111111
   十进制就是0~255
*/
// 数字类型
byte baseType = 0;
short baseshorttype = 0;
int baseinttype = 0;
long baselongtype = 0;
float basefloattype = 0;
double basedoubletype = 0;
// 布尔类型
Boolean basebooleantype = true;
// 字符类型
char basechartype = 'a';

```


