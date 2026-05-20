# 如何启动本地网站服务器

这个项目可以通过本地局域网服务器运行。启动后，和你在同一个 Wi-Fi / 局域网的人可以用你的电脑 IP 地址打开网站，不需要下载项目文件。

## 1. 打开 PowerShell

在 Windows 上打开 PowerShell。

## 2. 进入项目文件夹

复制并运行：

```powershell
cd "C:\Users\desktop\OneDrive\Desktop\CodeX Generated\Projects2"
```

## 3. 启动服务器

复制并运行：

```powershell
python -m http.server 8000 --bind 0.0.0.0
```

运行后不要关闭这个 PowerShell 窗口。只要这个窗口还在运行，网站服务器就还在运行。

## 4. 打开网站

你自己可以打开：

```text
http://127.0.0.1:8000/index.html
```

同一个 Wi-Fi / 局域网里的其他人可以打开：

```text
http://192.168.1.148:8000/index.html
```

## 5. 如果 IP 地址变了

重启电脑或切换 Wi-Fi 后，你的 IP 地址可能会变。

查看当前 IP：

```powershell
ipconfig
```

找到 `Wireless LAN adapter Wi-Fi` 下面的：

```text
IPv4 Address
```

如果显示的是：

```text
192.168.1.200
```

那么别人应该打开：

```text
http://192.168.1.200:8000/index.html
```

## 6. 停止服务器

回到正在运行服务器的 PowerShell 窗口，按：

```text
Ctrl + C
```

服务器就会停止。

## 7. 常见问题

### 别人打不开网站

检查这些事情：

- 你的电脑是否开机
- 你的电脑是否连接 Wi-Fi / 局域网
- 对方是否和你在同一个 Wi-Fi / 局域网
- PowerShell 服务器窗口是否还在运行
- IP 地址是否已经改变
- Windows 防火墙是否拦截了 Python 或端口 `8000`

### 重启电脑后还能访问吗

不能自动访问。重启电脑后，需要重新运行：

```powershell
cd "C:\Users\desktop\OneDrive\Desktop\CodeX Generated\Projects2"
python -m http.server 8000 --bind 0.0.0.0
```

### 需要一直打开 index.html 吗

不需要。只需要服务器命令一直运行，别人就可以通过浏览器访问网站。
