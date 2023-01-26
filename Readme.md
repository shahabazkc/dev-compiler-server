# DEV COMPILER


# To run the application

<h2>There are 2 ways to run the application<h2>
<p><b>Server orchestrated with</b></p>
<ul>
  <li>Docker Compose Orchestration</li>
  <li>Kubernetes Orchestration</li>
 </ul>


# For running with docker compose
<b> You should install docker in your system </b><br/><br/><br/>
<b> 
Step 1: Add a host in your host file and save.<br/><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Add this line "127.0.0.1 api.dev-compiler.com" or you can specify any domain which you wish. If you added any other custom domain insted of api.dev-compiler.com you should change the docker-compose.yaml file accordingly
</b><br/><br/>
<b> 
Step 2: "docker compose build"  Run this command from root folder.<br/><br/>
</b>
<b> 
Step 3: "docker compose up" Run this command from root folder.<br/><br/>
Now the Server will be running on your local.
</b>


# For running with kubernetes

<b> Step 1: install skaffold - https://skaffold.dev/docs/install/ </b>
