# Building-a-deployable-application-to-visualizing-the-output-of-a-Deep-Neural-Network-model
## 1. Vision and Goals Of The Project:
Develope an application for users to deploy their operationalized models in the cloud. This application includes a front-end UI and the computer vision repository. 
* Providing a user interface that allows user to visualize the output of a deployed computer vision model. Users can improve on and gain insights from their deployed 
model by storing test images in a file system and examined for correctness through the user interface.
* Providing a modular way for different models and different input/output signatures.
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
