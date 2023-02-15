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