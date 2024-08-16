### Theme
公共样式

## 用法
需要在html中配置console拦截，当sdk未加载完成时，将日志存储到localStorage中，待sdk加载完成时，再发送给服务器。
```html
<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <link rel="icon" href="<%= BASE_URL %>favicon.ico" />
    <title><%= htmlWebpackPlugin.options.title %></title>
    <script>
      // 备份原始的方法
      const originalMethods = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info,
      };

      // 重写console的方法
      for (let method in originalMethods) {
        console[method] = function (...args) {
          const log = { level: method.toUpperCase(), message: args.join(" ") }
          if (window.LPLogger) {
            window.LPLogger.report(log);
          } else if (localStorage) {
            const logs = JSON.parse(localStorage.getItem("__LP_LOGGER_LOAD__") || "[]");
            logs.push(log);
            localStorage.setItem("__LP_LOGGER_LOAD__", JSON.stringify(logs));
          }
          originalMethods[method].apply(console, args);
        };
      }

      // 用于查看当前页面网络请求
      let observer = new PerformanceObserver((list) => {
        let entries = list.getEntries();
        for (let entry of entries) {
          if (entry.name.match(/\/log$/)) {
            break
          }

          console.log(
            entry.name,
            entry.initiatorType,
            entry.deliveryType,
            entry.responseStatus
          );
        }
      });

      observer.observe({ entryTypes: ["resource"] });

      // 用于获取错误的请求
      window.addEventListener(
        "error",
        function (event) {
          if (event.target.tagName === "SCRIPT") {
            // 脚本加载错误
            console.error("Script loading error: " + event.target.src);
          } else if (event.target.tagName === "LINK") {
            // CSS 加载错误，记录到 VConsole
            console.error("loading error: " + event.target.href);
          } else {
            // 其他类型的错误，使用默认的 onerror 处理
            console.error(event);
          }
        },
        true
      );
    </script>
  </head>
  <body>
  </body>
</html>
```
