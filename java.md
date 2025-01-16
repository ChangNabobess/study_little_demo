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
