export default function addNoise(coordinate){
    /**
     * Function to add noise to a coordinate of a point to prevent full overlaps.
     */
    const sign = Math.round(Math.random())? 1 : -1;
    const fraction = 1/100 * Math.random();
    const eps = sign * fraction;
    return coordinate + eps;
}