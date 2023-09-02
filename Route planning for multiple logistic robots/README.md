Description:

This is a deep reinforcement learning project on the route planning problem for multiple logistic robots.
The project was executed on GCP, utilizing their Container Optimized Image and free credits.

The project focuses on "simultaneous individual local planning"
- Local: Each robot does not have access to the complete map and instead is only provided with the next waypoint + recent sensor data.
- Simultaneous and individual: There is no collaboration between robots, and the robots have to make their plan at the same moment.

The goal of the project is thus to investigate, under such demanding condition, what reinforcement learning methodologies can produce meaningful learning. The project shows that it is indeed possible to train a single-agent policy that adapts to multi-agent environment by 
- combining trajectory data from individual robots.
- search for optimal reward function using black-box optimization

Each training instance is a Docker compose, which includes a training simulation container, a evaluation simulation container, and the deep RL container.
Furthermore, the reward function in each training instances is decided by a search process (CMA-ES).

9 training instances are deployed on GCP simultaneously, which the evaluation result will influence the reward function of the next 9 training instances.

Please refer to the PPT and PDF for more details on how the project is structured.
