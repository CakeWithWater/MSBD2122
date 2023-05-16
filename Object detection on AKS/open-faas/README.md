# Open FaaS Functions

## Prerequisite
- Open FaaS has been deployed on a k8s cluster  
- `faas-cli` (Open FaaS command line interface https://docs.openfaas.com/cli/install/)

## Build function
`faas build -f ./extract-metadata.yml`

## Push function to repository  
Note: The remote depository is coded in each of the YML file.  
`faas push -f ./extract-metadata.yml`

## Deploy function to Open FaaS
Note: Since the cluster DNS name is used for the gateway address when the function is deployed on the cluster, to initially deploy the function remotely we specific the `--gateway` option and provide login details.  
Example (by port forwarding):
```
kubectl port-forward -n openfaas svc/gateway 8080:8080

PASSWORD=$(kubectl get secret -n openfaas basic-auth -o jsonpath="{.data.basic-auth-password}" | base64 --decode; echo)
echo -n $PASSWORD | faas login --username admin --password-stdin --gateway=localhost:8080

faas deploy -f ./extract-metadata-redis.yml --gateway=localhost:8080
```
You will need to provide the corresponding secret in the `openfaas-fn` namespace on cluster if the function image is pulled from a private repository.
`
