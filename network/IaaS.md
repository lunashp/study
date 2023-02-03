# Vsphere
## vsphere 네트워크 세팅 후 웹 콘솔 
```
vim /etc/ssh/sshd_config

PasswordAuthentication yes

UsePAM no

---

service sshd restart
service ssh restart
```