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

## bosh 배포 중 에러 시 
```
...
Uploading stemcell 'bosh-vsphere-esxi-ubuntu-jammy-go_agent/1.80'... Failed (00:00:16)
Cleaning up rendered CPI jobs... Finished (00:00:00)

creating stemcell (bosh-vsphere-esxi-ubuntu-jammy-go_agent 1.80):
  CPI 'create_stemcell' method responded with error: CmdError{"type":"Unknown","message":"Could not find 'VimSdk::Vim::ResourcePool': {:root=\u003e\n  #\u003cVimSdk::Vim::ResourcePool:0x00007f909d4ae978\n   @__mo_id__=\"resgroup-1002\",\n   @__stub__=\n    #\u003cVSphereCloud::SdkHelpers::RetryableStubAdapter:0x00007f909cde31e8\n     @retry_judge=#\u003cVSphereCloud::SdkHelpers::RetryJudge:0x00007f909cde3148\u003e,\n     @retryer=#\u003cVSphereCloud::Retryer:0x00007f909cde3080\u003e,\n     @stub_adapter=\n      #\u003cVimSdk::Soap::StubAdapter:0x00007f909cde33c8\n       @api_uri=#\u003cURI::HTTPS https://61.252.53.230/sdk/vimService\u003e,\n       @http_client=\n        #\u003cVSphereCloud::CpiHttpClient:0x00007f909cddf890\n         @backing_client=\n          #\u003cHTTPClient:0x00007f909cddf6d8\n           @base_url=nil,\n           @cookie_manager=\n            #\u003cWebAgent::CookieManager:0x00007f909cddd6d0\n             @accept_domains=[],\n             @cookies=\n              [#\u003cWebAgent::Cookie:0x00007f909ce88b48\n                @discard=true,\n                @domain=\"61.252.53.230\",\n                @domain_orig=nil,\n                @expires=nil,\n                @http_only=true,\n                @name=\"vmware_soap_session\",\n                @override=nil,\n                @path=\"/\",
  \n
  ...          
```
$ ubuntu@ubuntu:~/workspace/paasta-deployment/bosh$ vim deploy-vsphere.sh
```
@@ -4,9 +4,9 @@ bosh create-env bosh.yml \
        --state=vsphere/state.json \
        --vars-store=vsphere/creds.yml \
        -o vsphere/cpi.yml \
-       -o vsphere/resource-pool.yml  \
        -o uaa.yml  \
        -o credhub.yml  \
        -o jumpbox-user.yml  \
        -o cce.yml \
+       -o cce-check.yml \
        -l vsphere-vars.yml
```
- -o vsphere/resource-pool.yml  \ 삭제

$ ubuntu@ubuntu:~/workspace/paasta-deployment/bosh$ vim deploy-vsphere.sh
```
#!/bin/bash
  
BOSH_ENVIRONMENT="${BOSH_ENVIRONMENT}"                   # bosh director alias name 

bosh -e ${BOSH_ENVIRONMENT} -d paasta -n deploy paasta-deployment.yml \
        -o operations/use-haproxy.yml \
        -o operations/use-haproxy-public-network-vsphere.yml \
        -o operations/rename-network-and-deployment.yml \
        -l vars.yml \
        -l ../../common/common_vars.yml \
        -o operations/cce.yml \
        -o operations/cce-check.yml
```

ubuntu@ubuntu:~/workspace/paasta-deployment/paasta$ vim vars.yml
```
# SERVICE VARIABLE
deployment_name: "paasta"               # Deployment Name
network_name: "default"                 #
J꽊~T Default Network Name
haproxy_public_ip: "10.0.20.50" # 
~Z~T)
haproxy_public_network_name: "proxy"    # PaaS-TA Public Network Name
haproxy_private_network_name: "default" # PaaS-TA Private Network Name (vSphere use-haproxy-public-network-vsphere.yml
```
- 수정한 cloud-config에 맞게 파일 설정
        + haproxy_public_network_name: "proxy"
        + haproxy_private_network_name: "default"

