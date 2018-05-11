export function getImageFromArray(images, firstImageName, secondImageName) {
    if (images == null || images.length == 0) {
        return 'https://i.imgur.com/8tiuMUU.png'
    }
    let image = null;
    images.forEach((item)=> {
        if (item.name === firstImageName) {
            image = item.url;
        }
        if (image == null && item.name === secondImageName) {
            image = item.url;
        }
    });
    image = (image == null) ? images[0].url : image;
    if (image === '') {
        image = 'https://i.imgur.com/8tiuMUU.png';
    }
    return image;
}