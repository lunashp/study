## SSL 인증서 생성 시 error
```
root@pub-vm-1:/home1/ncloud/system-cert# docker run -it --rm  -v '/root/system-cert:/etc/letsencrypt'  -v '/root/system-cert:/var/lib/letsencrypt'  certbot/certbot certonly -d "*.$SYSTEM_DOMAIN" --manual --preferred-challenges dns --server https://acmev02.api.letsencrypt.org/directory --register-unsafely-without-email
Saving debug log to /var/log/letsencrypt/letsencrypt.log
An unexpected error occurred:
requests.exceptions.ConnectionError: HTTPSConnectionPool(host='acmev02.api.letsencrypt.org', port=443): Max retries exceeded with url: /directory (Caused by NewConnectionError('<urllib3.connection.HTTPSConnection object at 0x7f58aa818b80>: Failed to establish a new connection: [Errno -2] Name does not resolve'))
```
- 443 port 개방 필요 

## certificate 등록 가이드대로 진행 시 인증서 오류
- rsa 암호화 방식으로 인증서 발급 필요

### ncp guide version
```
$ docker run -it --rm \
 -v '/root/system-cert:/etc/letsencrypt' \
 -v '/root/system-cert:/var/lib/letsencrypt' \
 certbot/certbot certonly -d "*.$APPS_DOMAIN"" --manual --preferred-challenges dns --server https://acme-v02.api.letsencrypt.org/directory --register-unsafely-without-email
```
### rsa 인증서 적용 version
```
docker run -it --rm \
 -v '/root/system-cert:/etc/letsencrypt' \
 -v '/root/system-cert:/var/lib/letsencrypt' \
 certbot/certbot certonly -d "*.$APPS_DOMAIN" --manual --preferred-challenges dns --key-type rsa --server https://acme-v02.api.letsencrypt.org/directory --register-unsafely-without-email
```

## NKS 연동 시 에러
- json 변환 해당 사이트 참고
   + http://json.parser.online.fr/
```
cf create-service nks 10 nks-sample -c '{
"name" : "cluster-sample",
"k8sVersion" : "1.23.9-nks.1",
"subnetNoList" : "13623",
"publicNetwork" : true,
"subnetLbNo" : 13626,
"loginKeyName" : "ncp-paasta-admin-key",
"defaultNodePool.name": "dnp-sample",
"defaultNodePool.nodeCount" : 1,
"defaultNodePool.productCode" : "SVR.VSVR.STAND.C002.M008.NET.SSD.B050.G002",
"log.audit" : true,
"nodePool" : "[{\"name\":\"np-sample\",\"productCode\":\"SVR.VSVR.STAND.C002.M008.NET.SSD.B050.G002\",\"nodeCount\":2}]"
 }'
```
- k8sVersion
- subnetNoList
   + 대시보드 subnet(VM 서버)
- subnetLbNo
   + 대시보드 subnet 

## NKS 값 설정 수정
```
ncloud@pub-vm:~$ cf create-service nks 10 nks-sample -c '{
> "name" : "cluster-sample",
> "k8sVersion" : "1.24.10-nks.1",
> "subnetNoList" : "15882",
> "publicNetwork" : true,
> "subnetLbNo" : 15880,
> "loginKeyName" : "ncp-paasta-admin-key",
> "defaultNodePool.name": "dnp-sample",
> "defaultNodePool.nodeCount" : 1,
> "defaultNodePool.productCode" : "SVR.VSVR.STAND.C002.M008.NET.SSD.B050.G002",
> "log.audit" : true,
> "nodePool" : "[{\"name\":\"np-sample\",\"productCode\":\"SVR.VSVR.STAND.C002.M008.NET.SSD.B050.G002\",\"nodeCount\":2}]"
>  }'
Creating service instance nks-sample in org system / space system-space as 0ad43080-d269-11ec-9996-005056a7e1b2...

Create in progress. Use 'cf services' or 'cf service nks-sample' to check operation status.
OK

ncloud@pub-vm:~$ cf services
Getting service instances in org system / space system-space as 0ad43080-d269-11ec-9996-005056a7e1b2...

name              offering        plan   bound apps           last operation       broker               upgrade available
nks-sample        nks             10                          create in progress   ncp-service-broker   no
nsb-credentials   user-provided          ncp-service-broker      
```