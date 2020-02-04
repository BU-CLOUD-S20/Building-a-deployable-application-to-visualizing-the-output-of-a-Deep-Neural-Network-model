# Building-a-deployable-application-to-visualizing-the-output-of-a-Deep-Neural-Network-model
## 1. Vision and Goals Of The Project:
Develope an application for users to deploy their operationalized models in the cloud. This application includes a front-end UI and the computer vision repository. 
* Providing a user interface that allows user to visualize the output of a deployed computer vision model. Users can improve on and gain insights from their deployed model by storing test images in a file system and examined for correctness through the user interface. This user interface should be deployed to the cloud.
* Providing a modular way for different models and different input/output signatures.
## 2. Users/Personas Of The Project
Target Audience:
* General Data scientist and Software Engineers
* Quick Start for professional computer vision expert
* Practitioners who wants to deploy computer vision model in the cloud
## 3. Scope and Features of the Project
* UI/Frontend
    * Simple site for users to upload and view images and DNN results
    * Allows images to be shown with either hard coded or API-returned rectangle coordinates for object classification and tracing
    * Supports visualizations for multiple DNN scenarios, as well as the ability to switch between them
    * Flexible display to accommodate tablet and mobile devices
    * Uses Plotly to enable basic interactivity
    * Allows images to be uploaded from other sources, such as webcam
* REST API
    * Can deploy and run DNN model via provided Jupyter notebooks
    * Can run model either locally or via cloud service
    * Can take single image as input, or do batch scoring with multiple images
    * API scenarios include Classification, Similarity, Detection, Keypoints, Action recognition, and Crowd counting, but can support user defined scenarios as well
* Image Similarity
    * Precomputes features for reference set, and stores them on disk for later use
    * Can do precomputing locally or via cloud service
    * Can run model either locally or via cloud service
## 4. Solution Concept
System components that are building blocks of the design:
 * Jupyter Notebooks: walk users through creating and “publishing” DNN models
 * DNN Models: users’ trained models
 * UI-DNN: HTML interface for testing published DNN models (all except “Similarity” DNN models)
 * UI-DNN-Sim: HTML interface for testing published “Similarity” DNN models
 * Test Images: existing images the user uploads through UI-DNN or UI-DNN-Sim to test their models
 * Capture Images: realtime webcam images captured by UI-DNN or UI-DNN-Sim to test models
 * Azure Container/Kubernetes: DNN model publishing locations for all except “Similarity” models (can publish to either service)
 * REST API: communication end-point where UI-DNN and Azure-published models interact
 * Local Web Server: used to serve/execute UI-DNN-Sim in all instances; used to serve/execute UI-DNN in MVP
 * Azure Blob Storage: alternate publishing location for UI-DNN (as stretch goal)
![solution concept](https://github.com/BU-CLOUD-S20/Building-a-deployable-application-to-visualizing-the-output-of-a-Deep-Neural-Network-model/blob/master/solution%20concept.png)

Figure 1: Proposed architecture
Many design decisions have not been made yet. Three notable decisions evident above:
  * “Similarity” DNN models will be kept local (and not published to Azure) based on current best practices due to the complexity of executing them.
  * UI-DNN-Sim as separate code: since it will return a list of similar images to be displayed (vs. text / bounding boxes for the other models), the interface will differ significantly; also, since it will only interface with local models and code, there is no requirement to publish this element to Azure Blob Storage.
  * Server requirement (local or cloud) for UI elements: REST APIs and local file APIs (for loading test images) cannot be accessed if the HTML/Javascript files are not loaded and access via a web server. These are web standards and cannot be avoided. 
## 5.Acceptance criteria
Minimum acceptance criteria is a running UI (UI-DNN) that allows users to publish their DNN models to Azure Container/Kubernetes and output visualizations for multiple DNN scenarios; except for UI of “similarity” DNN models (UI-DNN-Sim) which will be kept local and visualization will be output on local web server.

Stretch goals are:
  * Do precomputing of “similarity” DNN models and run models via cloud service.
  * Use Azure blob storage as an alternate publishing location for UI-DNN.
  * REST API expands from single image to taking multiple images as input; “batch scoring”
  * Allows for the use of webcam as input.
  * Improve visualizations for UI-DNN such as adding interactive components and has appropriate UI for cell phone.
## 6.Release Planning:
Plans and meeting notes are on the Trello board: https://trello.com/b/Cz7rU2Kz

Release #1 (due by Week 5):
Document and upload work to CVBP via code review
UI: 
* Implement simple UI-DNN HTML interface for testing published DNN models via local web server
	* Site shows uploaded image
	* Site shows uploaded image with hard-coded rectangle co-ordinates

Image Similarity:
* Run “similarity” DNN model via provided Jupyter notebooks (00, 01, 12)
* Summarize pain points with CVBP

API:
* Run 00, 01, and 03 image classification Jypyter notebooks
* Summarize pain points with CVBP

...
 
Release #2 (due by Week 7):

UI-DNN: 
* Site shows uploaded image with API-returned rectangle co-ordinates
* Add drop-down menu to supports image classification and object detection

Image Similarity:
* Precomputes features for reference set, and stores on disk 

API: 
* Deploy API using the provided CVBP notebooks to cloud

...

Release #3 (due by Week 9):

UI-DNN-Sim:
* Implement simple UI-DNN-Sim HTML interface for testing published “similarity” DNN models via local web server
	* Site returns list of similar images to be displayed based on features

Image Similarity:
* Run website from local PC

API:
* Expand from taking single image input to do batch scoring with multiple images as input
* Deploy API to the cloud

...

Release #4 (due by Week 11):

UI-DNN:
* Add plotly to the interface for better visualization and interactive elements of the UI

UI-DNN & UI-DNN-Sim:
* Allow for realtime webcam images captured by UI-DNN or UI-DNN-Sim as an input to test models

Image Similarity:
* Explore options to upload “similarity” DNN models to cloud, execute if action is plausible

...

Release #5 (due by Week 13):
* Addition/modification of UI interactive elements:
	* Appropriate interface for cell phone
*  Add Azure Blob Storage as an alternate publishing location for UI-DNN 

