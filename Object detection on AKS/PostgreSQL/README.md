# PostgreSQL
PostgreSQL is a robust open-source database management system that supports both SQL relational query and JSON non-relational query.

## Configure Persistent Storage
```
pv.yaml
```
```
pvc.yaml
```
## Create the volume and claim
```
kubectl apply -f pv.yaml
kubectl apply -f pvc.yaml
```
##  Connection
### Export Password
```
export POSTGRES_PASSWORD=$(kubectl get secret --namespace pgsql pgsql-postgresql -o jsonpath="{.data.postgres-password}" | base64 --decode)
```
### Connect
```
kubectl run pgsql-postgresql-client --rm --tty -i --restart='Never' --namespace pgsql --image docker.io/bitnami/postgresql:14.2.0-debian-10-r74 --env="PGPASSWORD=$POSTGRES_PASSWORD" \
      --command -- psql --host pgsql-postgresql -U postgres -d postgres -p 5432
```
## Create Table
### Connect to the database
```
\c postgres
```
### Create table metadata
```
CREATE TABLE metadata(
      img_id VARCHAR (50) PRIMARY KEY,
      labels TEXT[],
  	thumbnail VARCHAR(50),
  	creation_time TIMESTAMP,
      lat_d FLOAT (50),
   	lat_m FLOAT (50),
      lat_s FLOAT (50),
      lat_direction CHAR (1),
  	long_d FLOAT,
   	long_m FLOAT,
      long_s FLOAT,
      long_direction CHAR (1),
  	exif_make VARCHAR (50),
  	exif_model VARCHAR (50),
  	dimen_width INTEGER,
  	dimen_height INTEGER,
  	file_size VARCHAR (50), 
  	format VARCHAR (50) 
);
```
