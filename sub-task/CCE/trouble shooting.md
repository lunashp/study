## test vm 배포 시 
### linux, mysql 다중 시트(py) release 업로드 후 배포
```
Task 804 | 08:50:20 | Error: - Failed to find variable '/micro-bosh/test/mariadb_azs' from config server: HTTP Code '404', Error: 'The request could not be completed because the credential does not exist or you do not have sufficient authorization.'
- Failed to find variable '/micro-bosh/test/mariadb_instances' from config server: HTTP Code '404', Error: 'The request could not be completed because the credential does not exist or you do not have sufficient authorization.'
- Failed to find variable '/micro-bosh/test/private_networks_name' from config server: HTTP Code '404', Error: 'The request could not be completed because the credential does not exist or you do not have sufficient authorization.'
- Failed to find variable '/micro-bosh/test/vm_type_default' from config server: HTTP Code '404', Error: 'The request could not be completed because the credential does not exist or you do not have sufficient authorization.'
- Failed to find variable '/micro-bosh/test/stemcell_os' from config server: HTTP Code '404', Error: 'The request could not be completed because the credential does not exist or you do not have sufficient authorization.'
- Failed to find variable '/micro-bosh/test/stemcell_version' from config server: HTTP Code '404', Error: 'The request could not be completed because the credential does not exist or you do not have sufficient authorization.'
```
### 해결
#### ubuntu@ubuntu:~/workspace/service-deployment/test$ vim deploy.sh
```
#!/bin/bash

# VARIABLES
COMMON_VARS_PATH="../../common/common_vars.yml"       # common_vars.yml File Path (e.g. ../../common/common_vars.yml)
CURRENT_IAAS="vsphere"                                   # IaaS Information (PaaS-TA뽗~P뽄~\ 뺠~\공꽐~X꽊~~
T create-bosh-login.sh 미 뽂¬뽚©뽋~\ aws/azure/gcp/openstack/vsphere 뽞~E꺠¥)
BOSH_ENVIRONMENT="${BOSH_ENVIRONMENT}"                   # bosh director alias name (PaaS-TA뽗~P뽄~\ 뺠~\공
~P~X꽊~T create-bosh-login.sh 미 뽂¬뽚©뽋~\ bosh envs뽗~P뽄~\ 뽝´륾D뽝~D 콙~U뽝¸콕~X뽗¬ 뽞~E꺠¥)

# DEPLOY
bosh -e ${BOSH_ENVIRONMENT} -n -d test deploy --no-redact test.yml \
     -o operations/cce.yml \
     -o operations/cce-check.yml \
     -l ${COMMON_VARS_PATH} \
     -l vars.yml
```
- -o operations/cce-check.yml \ 
   + \ 누락

## Linux 파일 겹침으로 인한 에러 (Ref 파일)
- 기존 코드
```
# -*- coding: utf-8 -*-
import pandas as pd
import re
import glob

for filename in glob.glob('test/bosh/Linux*.txt'):
    f = open(filename, "rt", encoding="UTF-8")
    txt_list = f.readlines()
    f.close()
    data = "".join(txt_list)
```

### 변경 코드 1
- 해당 코드 shell 에서 erorr
```
# -*- coding: utf-8 -*-
import pandas as pd
import re
import glob

for filename in glob.glob('test/bosh/Linux*[!A-Z].txt'):
    f = open(filename, "rt", encoding="UTF-8")
    txt_list = f.readlines()
    f.close()
    data = "".join(txt_list)
```
- 정규식으로 대문자 제외

### 변경 코드 2 
```
# -*- coding: utf-8 -*-
import pandas as pd
import re
import glob

for filename in glob.glob('./Linux*[!Ref].txt'):
    f = open(filename, "rt", encoding="UTF-8")
    txt_list = f.readlines()
    f.close()
    data = "".join(txt_list)
```
- Ref 파일 제외

## cce-check release 포함 배포 중 에러
```
Task 497

Task 497 | 06:13:22 | Error: Colocated job 'cce-service' is already added to the instance group 'uaa'

Task 497 Started  Tue Jan 31 06:13:22 UTC 2023
Task 497 Finished Tue Jan 31 06:13:22 UTC 2023
Task 497 Duration 00:00:00
Task 497 error

Updating deployment:
  Expected task '497' to succeed but state is 'error'

Exit code 1
```
- uaa 가 중복되어 선언되어 있음

### 기존 코드
```
ubuntu@ubuntu:~/workspace/paasta-deployment/paasta/operations$ cat cce-check.yml 
---
- type: replace
  path: /releases/-
  value:
    name: cce-check
    url: file:///home/ubuntu/workspace/cce-check/release/cce-check-0.1.0.tgz
    version: 0.1.0

#########################################################
### paasta 
#########################################################
- type: replace
  path: /instance_groups/name=uaa/jobs/-
  value:
    name: cce-service
    release: cce-check
    properties:
      cce_scripts:
        - script_name: tomcat_v4.1.bin
          params: |
            /var/vcap/data/uaa/tomcat
            /var/vcap/data/uaa/tomcat/conf
            /var/vcap/data/uaa/tomcat/webapps
          env_variable: "export JRE_HOME=/var/vcap/packages/uaa/jdk"

### database :: mysql 인 경우
#- type: replace
#  path: /instance_groups/name=database/jobs/-
#  value:
#    name: cce-service
#    release: cce-check
#    properties:
#      cce_scripts:
#        - script_name: mysql_5.7_v4.1_PaaS-TA.bin
#          params: |
#            /var/vcap/packages/pxc/bin/mysql
#            /var/vcap/jobs/pxc-mysql/config/my.cnf
#            /var/vcap/sys/run/pxc-mysql/mysqld.sock
#            1
#            localhost
#            root/((cf_mysql_mysql_admin_password))

### database :: postgres 인경우
- type: replace
  path: /instance_groups/name=database/jobs/-
  value:
    name: cce-service
    release: cce-check
    properties:
      cce_scripts:
        - script_name: postgresql_v4.1.bin
          params: |
            /var/vcap/packages/postgres-11.10/bin
            /var/vcap/store/postgres/postgres-11.10
            127.0.0.1
            cloud_controller
            5524
            vcap


- type: replace
  path: /instance_groups/name=api/jobs/-
  value:
    name: cce-service
    release: cce-check
    properties:
      cce_scripts:
        - script_name: nginx.sh


#- type: replace
#  path: /instance_groups/name=uaa/jobs/-
#  value:
#    name: cce-service
#    release: cce-check
#    properties:
#      cce_scripts:
#        - script_name: uaa.sh

```

### 변경 코드
```
ubuntu@ubuntu:~/workspace/paasta-deployment/paasta/operations$ cat cce-check.yml 
---
- type: replace
  path: /releases/-
  value:
    name: cce-check
    url: file:///home/ubuntu/workspace/cce-check/release/cce-check-0.1.0.tgz
    version: 0.1.0

#########################################################
### paasta 
#########################################################
- type: replace
  path: /instance_groups/name=uaa/jobs/-
  value:
    name: cce-service
    release: cce-check
    properties:
      cce_scripts:
        - script_name: tomcat_v4.1.bin
          params: |
            /var/vcap/data/uaa/tomcat
            /var/vcap/data/uaa/tomcat/conf
            /var/vcap/data/uaa/tomcat/webapps
          env_variable: "export JRE_HOME=/var/vcap/packages/uaa/jdk"
        - script_name: uaa.sh

### database :: mysql 인 경우
#- type: replace
#  path: /instance_groups/name=database/jobs/-
#  value:
#    name: cce-service
#    release: cce-check
#    properties:
#      cce_scripts:
#        - script_name: mysql_5.7_v4.1_PaaS-TA.bin
#          params: |
#            /var/vcap/packages/pxc/bin/mysql
#            /var/vcap/jobs/pxc-mysql/config/my.cnf
#            /var/vcap/sys/run/pxc-mysql/mysqld.sock
#            1
#            localhost
#            root/((cf_mysql_mysql_admin_password))

### database :: postgres 인경우
- type: replace
  path: /instance_groups/name=database/jobs/-
  value:
    name: cce-service
    release: cce-check
    properties:
      cce_scripts:
        - script_name: postgresql_v4.1.bin
          params: |
            /var/vcap/packages/postgres-11.10/bin
            /var/vcap/store/postgres/postgres-11.10
            127.0.0.1
            cloud_controller
            5524
            vcap


- type: replace
  path: /instance_groups/name=api/jobs/-
  value:
    name: cce-service
    release: cce-check
    properties:
      cce_scripts:
        - script_name: nginx.sh


#- type: replace
#  path: /instance_groups/name=uaa/jobs/-
#  value:
#    name: cce-service
#    release: cce-check
#    properties:
#      cce_scripts:
#        - script_name: uaa.sh

```
- `script_name: uaa.sh` 를 병렬로 선언
