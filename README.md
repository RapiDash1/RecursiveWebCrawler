# RecursiveWebCrawler

Recursively crawls a website and stores all unique urls, number of times it has been referenced and parameters associated with it in Redis. Crawling happens asynchronously and concurrently through 5 channels.

---

### Built With
- NodeJs
- Redis
- Docker

---

## Getting Started

To get a local copy up and running follow these simple example steps.

### Preqrequisites

- Docker   
    - [Dowload and Install](https://www.docker.com/products/docker-desktop) Docker for running this web app.
- Clone this repo to your local machine.

### Usage
- To run the web app, simply paste the following code in your terminal, replace  `<your_image_name>` and `<your_app_name>`  with your preferred names and hit enter.
    ```bash
    docker build -t <your_image_name>/<your_app_name)> .; docker run <your_image_name>/<your_app_name)>
    ```
- Wait for crawling to finish and have fun 😊.

---

## Author
- RapiDash1