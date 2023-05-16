# Object Detection on AKS  

Team members:  


Canvas Group:  
* 10

## Contributions


## Main tools used (other than Docker)
- kubectl (https://kubernetes.io/docs/tasks/tools/#kubectl)
- Helm (https://helm.sh/docs/intro/install/)
- Arkade (https://github.com/alexellis/arkade)

## Installation
### Redis
```
arkade install redis
```
### PostgreSQL
#### Add Helm Repo
```
helm repo add bitnami https://charts.bitnami.com/bitnami
```
#### Install
```
helm install pgsql bitnami/postgresql
```
#### Attach the persistent volume claim to the helm chart
```
helm install pgsql bitnami/postgresql --set persistence.existingClaim=postgresql-pv-claim --set volumePermissions.enabled=true
```

### Airflow
Airflow Helm Chart (User Community) https://github.com/airflow-helm/charts/tree/main/charts/airflow  
Note that `<image-tag>` is coded inside `airflow-helm-values.yaml`.
```
helm repo add airflow-stable https://airflow-helm.github.io/charts
helm repo update
kubectl create namespace airflow225
docker build -t <image-tag> ./airflow/
docker push <image-tag>
helm install airflow-cluster airflow-stable/airflow -n airflow225 --version "8.6.0" --values ./airflow/airflow-helm-values.yaml
```
### Open FaaS
```
arkade install openfaas
```

### Vue

Project setup

```
npm install
```

Compiles and hot-reloads for development

```
npm run serve
```

Compiles and minifies for production

```
npm run build
```

#### Nginx

Build the image and upload to docker hub

```
docker build -t <image-name>:<tag> .
docker tag <image-name>:<tag> <username>/<image-name>:<tag>
docker push <username>/<image-name>:<tag>
```

Deploy on k8s

```
kubectl apply -f backend.yaml
```

### Node.js Backend

Project setup

```
npm install
```

Build the image and upload to docker hub

```
docker build -t <image-name>:<tag> .
docker tag <image-name>:<tag> <username>/<image-name>:<tag>
docker push <username>/<image-name>:<tag>
```

Deploy on k8s

```
kubectl apply -f deploy.yaml
```

