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