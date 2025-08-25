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

### 0212

#### java 声明修饰符：sealed

```java
// 使用范例
public sealed class Base permits Sub1, Sub2 {};
```

### 0214

#### 面向对象基础

<table>
<tr> 
    <td>**知识点**</td>
    <td>**详情**</td>
</tr>
<tr> 
    <td>构造函数</td>
    <td>实现类的特殊方法，必须和类名保持一致</td>
</tr>
<tr> 
    <td>方法重载</td>
    <td>@Overload</td>
</tr>
<tr> 
    <td>方法重写</td>
    <td>@Override</td>
</tr>
<tr> 
    <td>继承</td>
    <td>extends、向上转型(upcasting)、向下转型(downcasting)</td>
</tr>
<tr> 
    <td>阻止继承</td>
    <td>密封类：sealed；必须搭配final、no-sealed、sealed一起使用</td>
</tr>
<tr> 
    <td>阻止继承平替方法</td>
    <td>abstract抽象类</td>
</tr>
<tr> 
    <td>类型转换</td>
    <td>String s = (String)obj;// 向下转型</td>
</tr>
<tr> 
    <td>多态(实际类型和引用类型的应用)</td>
    <td>针对某个类型的方法调用,真正执行的方法取决于运行时实际类型的方法，只有在运行的时候才能知道具体的类型</td>
</tr>
</table>

### 0825 MQ消费队列

1. connectionFactory; 创建连接工厂
2. connection; 创建连接
3. channel; 创建管道、通道
4. queueDeclare; 创建队列
5. basicConsume; 消费队列
6. basicAck; 确认消费
7. basicReject; 拒绝消费
8. basicNack; 拒绝消费
9. basicPublish; 发布消息
10. basicGet; 获取消息
11. basicRecover; 恢复消费
12. basicRecoverAsync; 异步恢复消费
13. basicQos; 设置消费队列的QOS
```java
<dependency>
  <groupId>com.rabbitmq</groupId>
  <artifactId>amqp-client</artifactId>
  <version>5.20.0</version>
</dependency>
/* ----生产者发送消息，不适用交换机模式----- */
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

public class Producer {
    private final static String QUEUE_NAME = "test_async_queue";

    public static void main(String[] args) throws Exception {
        // 1. 创建连接工厂
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");  // RabbitMQ 服务地址
        factory.setUsername("guest");
        factory.setPassword("guest");

        // 2. 创建连接 & 信道
        try (Connection connection = factory.newConnection();
             Channel channel = connection.createChannel()) {

            // 3. 声明队列
            channel.queueDeclare(QUEUE_NAME, true, false, false, null);

            // 4. 异步发送多条消息
            for (int i = 1; i <= 5; i++) {
                String message = "Hello MQ, this is message " + i;
                // 发送消息
                channel.basicPublish("", QUEUE_NAME, null, message.getBytes());
                System.out.println(" [x] Sent '" + message + "'");
                Thread.sleep(500); // 模拟间隔
            }
        }
    }
}

/* ----消费者接收消息----- */
import com.rabbitmq.client.*;

public class Consumer {
    private final static String QUEUE_NAME = "test_async_queue";

    public static void main(String[] args) throws Exception {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost");
        factory.setUsername("guest");
        factory.setPassword("guest");

        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();

        // 声明队列（要和生产者保持一致）
        // 直连模式
        channel.queueDeclare(QUEUE_NAME, true, false, false, null);

        System.out.println(" [*] Waiting for messages...");

        // 异步监听队列
        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            String message = new String(delivery.getBody(), "UTF-8");
            System.out.println(" [x] Received '" + message + "'");
        };
        channel.basicConsume(QUEUE_NAME, true, deliverCallback, consumerTag -> { });
    }
}

```
| 产品              | 特点                  | 适用场景           |
| --------------- | ------------------- | -------------- |
| **RabbitMQ**    | 功能丰富，支持复杂路由，延时队列    | 通用消息队列、异步处理    |
| **Kafka**       | 高吞吐、可回溯、分区机制        | 日志采集、大数据分析、事件流 |
| **RocketMQ**    | 阿里开源，支持事务消息、顺序消息    | 电商订单、金融交易      |
| **ActiveMQ**    | 老牌 MQ，支持 JMS 协议     | 传统 Java 企业系统   |
| **Redis**（简单队列） | 基于 list/pubsub，轻量、快 | 临时消息、简单任务分发    |

> MQ消息队列各大厂也会封装一些可复用的、实用的、兼容性强的工厂类，PS:ONSFactory(RocketMQ SDK)

#### RabbitMQ灵活路由模式，实用交换机exchange
```java
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
/* 
    消息生产者
*/
public class TopicProducer {
    private final static String EXCHANGE_NAME = "test_exchange_topic";
    public static void main(String[] args) throws Exception {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost("localhost"); // 默认端口是5672
        try{
            Connection connection = factory.newConnection();
            Channel channel = connection.createChannel();
            // 声明一个管道名称 交换机和队列之间的绑定关系，可以带上匹配规则。
            channel.exchangeDeclare(EXCHANGE_NAME,'topic');
            String routingKeys = {
                'log.success',
                'log.error',
                'log.info',
                'log.warn'
            }
            for(String routingKey: routingKeys){
                String message = "Hello MQ, this is message " + routingKey;
                channel.basicPublish(EXCHANGE_NAME,routingKey,null, message.getBytes('utf-8'));
                System.out.println(" [x] Sent '" + routingKey + "':'" + message + "'");
            }
        }
    }
}
```
```java
import com.rabbitmq.client.*;
/* 
    消费者
 */
public class TopicConsumer {
    Prictive static string EXCHANGE_NAME = 'test_exchange_topic';
    public static void main(String[] args) throws Exception{
        ConnectionFactory factory = new ConnectionFactory();
        Connection connection = factory.newConnection();
        Channel channel = connection.createChannel();
        channel.exchangeDeclare(EXCHANGE_NAME, 'topic');
        String queueName = channel.queueDeclare().getQueue();
        // 接收多有日志
        // 主题模式，RoutingKey 支持 模糊匹配（* 匹配一个单词，# 匹配多个单词）。
        // channel.queueBind(queueName, EXCHANGE_NAME, 'log.#');
        // System.out.println('[X]接收所有日志类型数据');
        // 只接受错误类型日志
        channel.queueBind(queueName, EXCHANGE_NAME, 'log.error');
        System.out.println('[X]只接受错误日志信息');
        DeliverCallback deliverCallback = (customerTag, delivery) => {
            String message = new String(delivery.getBody(), 'utf-8');
            System.out.println('[X] Received ' + message);
        }
        channel.basicConsume(queueName, true, deliverCallback, cutsomerTag => {});
    }
}
```