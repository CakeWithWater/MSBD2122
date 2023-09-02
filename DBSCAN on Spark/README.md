The main part of this project is to demonstrate a new algorithm for 2D Exact DBSCAN utilizing 
- the prowess of Catalyst Optimizer of Spark DataFrame 
- enhanced clustering calculation in RDD thanks to data structure created with DataFrame

The main innovation builds upon the prevalent paradigm
- Partition data
- Cluster partitioned data
- Merge clustering result
With Dataframe, a special grid structure is prepared that has some very strong properties.
- Grids with high enough density is efficiently clustered together. 
  This step does not need to consider all objects in the grid.
- Grids with low neighbor density is never considered.
  This allows skipping over sparse region.
- Remaining grids can approach the two types of grid from above "intelligently"
  This includes generation of information that allows clustering result from different partition to merge as efficiently as UNION FIND.

The result has been verified with a public dataset from the paper "Highly parallelized DBSCAN" (https://github.com/Markus-Goetz/hpdbscan).

The notebook was run on a Spark cluster of 12 executors on Azure.
The main clustering function was not refactored for the project submission, only to better illustrate the structure of the function.
