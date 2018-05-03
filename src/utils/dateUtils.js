let monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "June",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

export function getPublishDateDescription(time) {
    let publishDate = new Date(time);
    let currentDate = new Date();
    let distanceTime = currentDate.getTime() - publishDate.getTime();
    let distanceInHours = distanceTime/ (1000*3600);
    if (distanceInHours < 24) {
        if (distanceInHours < 1) {
            let distanceInMin = distanceTime/ (1000*60);
            if (distanceInMin < 1) {
                let distanceInSec = distanceTime/ (1000);
                return Math.floor(distanceInSec) + ' seconds ago';
            }
            return Math.floor(distanceInHours) + ' minutes ago';
        }
        return Math.floor(distanceInHours) + ' hours ago';
    } else {
        return publishDate.getDate() + " " + monthNames[publishDate.getMonth()];
    }
}