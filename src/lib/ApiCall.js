import axios from 'axios'

const getBaseUrl = (url) => {
switch (url) {
    case process.env.REACT_APP_STAGING_HOST:
        return process.env.REACT_APP_STAGING_BASE_URL
    case process.env.REACT_APP_LOCAL_HOST_NAME:
        return process.env.REACT_APP_LOCAL_BASE_URL
    case process.env.REACT_APP_DEV_HOST_NAME:
        return process.env.REACT_APP_DEV_BASE_URL
    case process.env.REACT_APP_PROD_HOST:
        return process.env.REACT_APP_PROD_BASE_URL
}
}

const instance = axios.create({
baseURL: getBaseUrl(window.location.hostname)
})
export default instance
