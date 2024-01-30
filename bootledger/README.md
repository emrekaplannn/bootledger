## Table of Contents

- [About](#about)
- [Installation](#installation)

## About
  
This is about how this project could be set up on your local machine, and how you can contribute it.
  
## Installation and usage
  
!! Curently we are using React EXPO for the project, for further doings please search for the REACT EXPO documentations. To maintain the project, use docker-compose
  
!! To install docker-compose, first install the docker with:
  
### Linux:
  
```sudo apt update```
  
```sudo apt install docker.io```
  
```sudo systemctl start docker```
  
```sudo systemctl enable docker```
  
```sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose```
  
```sudo chmod +x /usr/local/bin/docker-compose```
  
#### To verify the installation, run:
  
```docker --version```
  
```docker-compose --version```
  
1 - Install the git for your machine and install the latest nodejs version.
  
2 - Make a folder for the project to maintain it. 
  
```mkdir Project(Your folder) ```
  
Then: 	
  
```cd Project ```
  
3 - Enter your gitlab credentials with:
  
```git config --global user.name "USERNAME" ```
  
```git config --global user.email "EMAIL" ```
  
4 - Then clone the project with:
  
```https://gitlab.ceng.metu.edu.tr/group-22/bootledger.git ```
  
5 - Then change your directory to cloned folder
  
```cd <Folder> ```
  
> Also you need to install supabase on your machine:
  
> For linux based machines:
  
```git clone --depth 1 https://github.com/supabase/supabase ```
  
```cd supabase/docker```
  
```cp .env.example .env```
  
```sudo docker-compose up```
  
This should start up your docker containers
  
6 - When you are ready to contribute, in the project's directory run:

  
```git add <file or folder> ```
  
7 - After the 5th step, you can commit with:
  
```git commit -m "<YOUR COMMIT MESSAGE>" ```
  
8 - Finally, you can push with:
  
```git push origin <branch_name> ```


