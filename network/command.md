# dig
## domain information groper
- dig는 네트워크 관리 도구 중 하나로 DNS(Domain Name System)를 질의할 수 있는 도구
- nslookup 보다 더 편한 인터페이스와 사용법 제공
- IDN(Internationalized Domain Name) 쿼리를 지원 

### 기본 문법
```
Usage:  dig [@global-server] [domain] [q-type] [q-class] {q-opt}
            {global-d-opt} host [@local-server] {local-d-opt}
            [ host [@local-server] {local-d-opt} [...]]
```

### $ dig -h
- 커맨드 옵션 확인

### $ dig {질의명}
```
ncloud@pub-vm-1:~$ dig naver.com

; <<>> DiG 9.16.1-Ubuntu <<>> naver.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 4918
;; flags: qr rd ra; QUERY: 1, ANSWER: 4, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 65494
;; QUESTION SECTION:
;naver.com.			IN	A

;; ANSWER SECTION:
naver.com.		300	IN	A	223.130.195.95
naver.com.		300	IN	A	223.130.195.200
naver.com.		300	IN	A	223.130.200.104
naver.com.		300	IN	A	223.130.200.107

;; Query time: 4 msec
;; SERVER: 127.0.0.53#53(127.0.0.53)
;; WHEN: Fri Jan 20 11:11:31 KST 2023
;; MSG SIZE  rcvd: 102
```
- QUESTION SECTION: 질의 내용
- ANSWER SECTION: 서버의 응답 내용

### $ dig {질의명} [레코드명]
```
ncloud@pub-vm-1:~$ dig naver.com MX

; <<>> DiG 9.16.1-Ubuntu <<>> naver.com MX
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 57319
;; flags: qr rd ra; QUERY: 1, ANSWER: 3, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 65494
;; QUESTION SECTION:
;naver.com.			IN	MX

;; ANSWER SECTION:
naver.com.		75	IN	MX	10 mx1.naver.com.
naver.com.		75	IN	MX	10 mx2.naver.com.
naver.com.		75	IN	MX	10 mx3.naver.com.

;; Query time: 0 msec
;; SERVER: 127.0.0.53#53(127.0.0.53)
;; WHEN: Fri Jan 20 11:14:03 KST 2023
;; MSG SIZE  rcvd: 98
```
- 특정 레코드를 질의하고 싶을 때 사용
- 기본값은 A
- A, AAAA, CNAME, MX, TXT, NS, SOA, SRV, CAA, PTR, NSEC, NSEC3, RRSIG, RP 등 대부분 레코드(Resource Record)가 지원됨

### $ dig {질의명}[@서버 주소]
```
ncloud@pub-vm-1:~$ dig naver.com @8.8.8.8

; <<>> DiG 9.16.1-Ubuntu <<>> naver.com @8.8.8.8
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 63727
;; flags: qr rd ra; QUERY: 1, ANSWER: 4, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 512
;; QUESTION SECTION:
;naver.com.			IN	A

;; ANSWER SECTION:
naver.com.		190	IN	A	223.130.195.200
naver.com.		190	IN	A	223.130.200.104
naver.com.		190	IN	A	223.130.200.107
naver.com.		190	IN	A	223.130.195.95

;; Query time: 28 msec
;; SERVER: 8.8.8.8#53(8.8.8.8)
;; WHEN: Fri Jan 20 11:17:35 KST 2023
;; MSG SIZE  rcvd: 102
```
- 기존 네임서버가 아닌 특정 네임서버를 지정할 때 사용
- @서버 주소에 IP주소를 기재해도 되고, 호스트명(ns1 ...) 등을 기재해도 됨

### $ +trace
```
ncloud@pub-vm-1:~$ dig _acme-challenge.sys.paas-ta-dev04.kr. +trace

; <<>> DiG 9.16.1-Ubuntu <<>> _acme-challenge.sys.paas-ta-dev04.kr. +trace
;; global options: +cmd
.			6127	IN	NS	g.root-servers.net.
.			6127	IN	NS	c.root-servers.net.
.			6127	IN	NS	j.root-servers.net.
.			6127	IN	NS	e.root-servers.net.
.			6127	IN	NS	k.root-servers.net.
.			6127	IN	NS	a.root-servers.net.
.			6127	IN	NS	l.root-servers.net.
.			6127	IN	NS	i.root-servers.net.
.			6127	IN	NS	m.root-servers.net.
.			6127	IN	NS	f.root-servers.net.
.			6127	IN	NS	h.root-servers.net.
.			6127	IN	NS	d.root-servers.net.
.			6127	IN	NS	b.root-servers.net.
;; Received 262 bytes from 127.0.0.53#53(127.0.0.53) in 4 ms

kr.			172800	IN	NS	b.dns.kr.
kr.			172800	IN	NS	c.dns.kr.
kr.			172800	IN	NS	g.dns.kr.
kr.			172800	IN	NS	f.dns.kr.
kr.			172800	IN	NS	e.dns.kr.
kr.			172800	IN	NS	d.dns.kr.
kr.			86400	IN	DS	61615 8 2 ED570AADC88713CE2775FB8AFFB2AD782D056EA21D0677E147F2FB7B F54404DA
kr.			86400	IN	RRSIG	DS 8 1 86400 20230201170000 20230119160000 951 . UAU5+GogItDFM4xzr9pZNcsPcfu06iFkBIQj7ZmmA2F0V+xDXUmboW0a 8B8mPSH0quYIn5+tcmE6uqgX4O+l+vD4zMykgzxMjqeSk3bIXSF6Rjzk bbu5WiiKMK+ySdtH9/+omGDdr72MKSWe4R/CRT4+J/gOnLFmw3r4jHXa lasuU0iY/rfdO/8n93iWs2xvOJXNJGACAZ9bWucnFvL6JEGOvpjFQygw A5GnSqMRe3jd+8fg2efwT62DYd9F71XCQ1etAm+CY5zfaU9+26qMtqrY UWpYRWlb70YiyZBcVVwjWp2HfBh3hR+TAGAtG953iG1lC9HnVBIY3L+N f3R30g==
;; Received 708 bytes from 198.41.0.4#53(a.root-servers.net) in 36 ms

paas-ta-dev04.kr.	86400	IN	NS	ns1-2.ns-ncloud.com.
paas-ta-dev04.kr.	86400	IN	NS	ns1-1.ns-ncloud.com.
PSUK0EEKKGPOFH0K7H82HVC8G7K6E7R0.kr. 900 IN NSEC3 1 1 10 96E920 PT4MFNUDNRRDEP4266QTKPE25CG7698Q NS SOA RRSIG DNSKEY NSEC3PARAM
PSUK0EEKKGPOFH0K7H82HVC8G7K6E7R0.kr. 900 IN RRSIG NSEC3 8 2 900 20230218193145 20230119193145 25131 kr. s1r60Mqb7duC356NcKPOkVhffO6YV5nWsc89fYheyZt9ibaQCOuQ5S4k OcwcQ/kwhRRMTeW9pq32S5wlO9irIzQ+JHh9Az9xn0fxLXjFoQA9CjrF l/KPrCB3tU62COtxRA/7vYVLiYG0GPt2c5OVd7yuRffdXky3Vm4mD/Ba 88k=
2MLU7DQOOEGQ3E0VOIQHV47IKTODEFNG.kr. 900 IN NSEC3 1 1 10 96E920 2NS8JJ88K8KUOEOBTTKU7L67NQLMO0TT NS DS RRSIG
2MLU7DQOOEGQ3E0VOIQHV47IKTODEFNG.kr. 900 IN RRSIG NSEC3 8 2 900 20230218193145 20230119193145 25131 kr. k7XF1Npv3dmt3vJDkJCk8WOI0BGYlHA/ekARuKFpX3yci1UC23gL/iEH 2z+79G3wwiLWH8IwFNJjmmlwh30oENQ43IvEH4tmEdPyfDQiuwJ0pGd/ OFeZUue85MzLqez+tn312f3xnxtQqBMWPxmtc2uyWxbLNuLhFu6fDxca s18=
;; Received 623 bytes from 202.30.124.100#53(e.dns.kr) in 4 ms

;; Received 65 bytes from 49.236.157.6#53(ns1-2.ns-ncloud.com) in 4 ms
```
- DNS 질의 과정을 Rott DNS 부터 모두 표시해줌
- DNS 질의가 어디에서 실패하는지 확인해야 할 경우에 유용함
