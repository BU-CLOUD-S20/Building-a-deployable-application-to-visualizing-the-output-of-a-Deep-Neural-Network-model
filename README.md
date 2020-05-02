## Building a Deployable Application to Visualize the Output of a Deep Neural Network (DNN) Model

Team: Matthew Boyd, Charles Henneberger, Xushan "Mulla" Hu, SeungYeun "Kelly" Lee, Nuwapa "Prim" Promchotichai  
Mentors: Patrick Buehler, JS Tan, Young Park

*Updated: February 12, 2020*

#### Contents

0. [Sprint Presentations](#sprint-presentations)
1. [Vision and Goals Of The Project](#vision-goals)
2. [Users/Personas Of The Project](#users-personas)
3. [Scope and Features of the Project](#scope-features)
4. [Solution Concept](#solution-concept)
5. [Acceptance Criteria](#acceptance-criteria)
6. [Release Planning](#release-planning)

<a name="sprint-presentations"/>

## 0. Sprint Presentations

1. [Sprint 1](https://docs.google.com/presentation/d/1YJg0whEUxonBOJON-ExQi6li-OhU5VPepP93H8fXChw/edit?usp=sharing)
2. [Sprint 2](https://docs.google.com/presentation/d/1hkqTPE9fNCRs7QkaELIBK1OSxYvn8TqOkDwcS2QG1_o/edit?usp=sharing)
3. [Sprint 3](https://docs.google.com/presentation/d/e/2PACX-1vQK62-UelDsav2z0NQxnhVZvvVc4rSX7UKYpC7E7_pOrJso_WwE5MalFHqyyqyUJK_AVrTSesXwhf02/pub?start=false&loop=false&delayms=10000)
4. [Sprint 4](https://docs.google.com/presentation/d/e/2PACX-1vRIiyPYAzG6Amfh6nCoxzAFCrNwjDsKj0FHbRbf2pdrmHBDS4wSKhoE6sC6WU5Xfa5EOSA3Eei0STx1/pub?start=false&loop=false&delayms=3000
)
* [Pull Request link](https://github.com/mcboyd-bu/computervision-recipes/tree/contrib_html_demo/contrib/html_demo)
* [Front-End UI](https://javascript-work-1.matthewboyd1.repl.co/index_new.html)
5. [Sprint 5](https://docs.google.com/presentation/d/1mIWCY0Zoe-XiN_F12nO8Dr-s3WKh5lZNGZBeu_A_PJA/edit?usp=sharing)

### Paper Presentation
[EbbRT Paper Presentation](https://docs.google.com/presentation/d/e/2PACX-1vS__BZnB0DOHts27Xy7mbrzuihj3NCLJqTEy0SGE59aD2FTb8tLfRyOVHXdg--Fl12IZK5yiBSiU9S_/pub?start=false&loop=false&delayms=3000)

<a name="vision-goals"/>

## 1. Vision and Goals Of The Project

Develop an application for users to deploy their operationalized Deep Neural Network (DNN) models in the cloud. This application includes a front-end UI for the computer vision repository. 
* Provide a user interface that allows users to visualize the output of a deployed computer vision model. Users can improve on and gain insights from their deployed model by storing test images in a file system and examining them for correctness through the user interface. This user interface should be deployed to the cloud.
* Provide a modular way for different models and different input/output signatures.

<a name="users-personas"/>

## 2. Users/Personas Of The Project

Target Audience:

* General data scientists, software engineers, and professional computer vision experts who are developing/testing Deep Neural Networks (DNNs) that want an easier way to visualize their outputs

<a name="scope-features"/>

## 3. Scope and Features of the Project

* UI/Frontend
    * Simple site for users to upload and view images and DNN results
    * Allows images to be shown with API-returned rectangle coordinates for object classification and tracing
    * Supports visualizations for multiple DNN scenarios, as well as the ability to switch between them
    * Flexible display to accommodate tablet and mobile devices
    * Enable basic interactivity
    * Allows images to be uploaded from other sources, such as webcam
* REST API
    * Can deploy and run DNN model via provided Jupyter notebooks
    * Can run model via cloud service
    * Can take single image as input, or do batch scoring with multiple images
    * API scenarios include Classification, Similarity, Detection, and possibly keypoints, but can support user defined scenarios as well
* Image Similarity
   * Implement UI which, given a query image, shows the top N similar reference images.
   * Precomputes features locally for reference set, and stores them on disk for later use
   * Can deploy UI to the cloud

<a name="solution-concept"/>

## 4. Solution Concept

System components that are building blocks of the design:
 * Jupyter Notebooks: walk users through creating and “publishing” DNN models
 * DNN Models: users’ trained models
 * UI-DNN: HTML interface for testing published DNN models (all except “Similarity” DNN models)
 * UI-DNN-Sim: HTML interface for testing published “Similarity” DNN models
 * Test Images: existing images the user uploads through UI-DNN or UI-DNN-Sim to test their models
 * Capture Images: realtime webcam images captured by UI-DNN or UI-DNN-Sim to test models
 * Azure Container/Kubernetes: DNN model publishing locations, with focus on simplicity and low cost (e.g., CPU vs GPU resources) - can publish to either service
 * REST API: communication end-point where UI elements and Azure-published models interact
     * Models must implement scoring functions as outlined in the Miscrosoft CVBP repository
 * Local Web Server: used to serve/execute UI elements in MVP
 * Azure Blob Storage: alternate publishing location for UI elements (as stretch goal)
![solution concept](https://github.com/BU-CLOUD-S20/Building-a-deployable-application-to-visualizing-the-output-of-a-Deep-Neural-Network-model/blob/master/solution_concept.png)

Figure 1: Proposed architecture
Many design decisions have not been made yet. Three notable decisions evident above:
 * “Similarity” DNN models may be kept local (and not published to Azure) based on current best practices due to the complexity of executing them - still investigating.
  * UI-DNN-Sim as separate code: since it will return a list of similar images to be displayed (vs. text / bounding boxes for the other models), the interface will differ significantly; also, since it will interface with local models and code for finding similar images, even after publishing to the cloud, it will have different requirements.
 * Server requirement (local or cloud) for UI elements: REST APIs and local file APIs (for loading test images) cannot be accessed if the HTML/Javascript files are not loaded and access via a web server. These are web standards and cannot be avoided. 

<a name="acceptance-criteria"/>

## 5. Acceptance Criteria

Minimum acceptance criteria is a deployed UI (UI-DNN) which calls a cloud-based REST API and visualizes its output for multiple DNN scenarios (Image Classification and Object Detection).

Stretch goals are:
* UI supports visualization for image similarity model.
* REST API expands from single image input to taking multiple images as input; “batch scoring”
* Allows for the use of webcam as input.
* Improve visualizations for user interface; create appropriate UI for cell phone.
* Add another option on UI to allow users to view the example output of DNN models from Microsoft.

<a name="release-planning"/>

## 6. Release Planning

Plans are on Taiga: https://tree.taiga.io/project/mosayyebzadeh-building-deployable-application-visualizing-the-output-deep-neural-network/backlog

### Release #1 (due by Week 5 - Sprint 1):

UI: 
* Design a simple HTML interface for testing published DNN models via local web server
	* Create a hi-fi wireframe of the user interface

Image Similarity:
* Run “similarity” DNN model via provided Jupyter notebooks (00, 01, 12) on Microsoft CVBP github repository.
* Summarize pain points from the provided Jupyter notebooks and present the pain points to mentors.

API:
* Run 00, 01, and 03 image classification Jypyter notebooks from Microsoft CVBP github repository.
* Summarize pain points with CVBP github repo and present the pain points to mentors.

### Release #2 (due by Week 7 - Sprint 2):

UI: 
* Implement simple HTML interface for testing published DNN models based on hi-fi wireframe designed 
* Add functionalities to the front-end so that:
	* website allows single image input
	* webite shows uploaded image with hard-coded rectangle co-ordinates (to visualize the output of DNN models)
	* there is error checking for valid API input
	
Image Similarity:
* Write up image similarity Jupyter notebook to:
	* Precomputes image features for reference set, and stores on disk
	* Load precomputed features and compare with a query image (on local machine, code is provided in the notebooks)
* Explore options to upload “similarity” DNN models to cloud, execute if action is plausible

API: 
* Deploy API using the provided CVBP notebooks to cloud
 
### Release #3 (due by Week 9 - Sprint 3):

UI:
* Add functionalities to front-end and back-end:
	* Website allows multiple images (upto 4 images) input and display the 4 input images.
	* Create two tabs on UI; first tab allows users to test and visualize their own DNN models, second tab allows users to select from example set of images and visualize the output of DNN model from Microsoft on the example set of images.

API:
* Expand from taking single image input to do batch scoring with multiple images as input
* Deploy API to the cloud

Image Similarity:
* Test Image Similarity Jupyter notebook, verify that there are no errors.
* Implement simple HTML interface for testing published “similarity” DNN models via local web server
	* Site returns list of similar images to be displayed based on features
* Run website from local PC
 
### Release #4 (due by Week 11 - Sprint 4):

Connect front-end and back-end to create a functional UI.

Minimum viable product (MVP) is completed.

Document and upload work to Microsoft CVBP github repository via code review

UI:
* Addition/Modification of UI elements:
	* Remove white spaces from the UI
	* Change modal pop-up to collapsible component.
	* Add steps on how to navigate the UI to the website.
	* Add "About" tab to give detailed information about the project on the website.


### Release #5 (due by Week 13 - Sprint 5):

* Document and upload work to CVBP via code review.

* Wrap up the project.

Evangelism:
* Blog about the work and share on social media
* Demo work to Microsoft via virtual Microsoft Lunch and Learn 




