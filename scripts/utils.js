export default function setAnimationTimeout(delay) {
    return new Promise(resolve => setTimeout(resolve, delay));
}
