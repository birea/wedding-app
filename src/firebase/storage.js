import { storage } from "./firebase";

export const uploadFile = (path, uid, idReq, textFile, fileName) => {

    const metadata = {
        contentType: "text"
    };

    // Create a root reference
    const storageRef = storage.ref();
    // Create a reference to "images/mountains.jpg"
    const fileRef = storageRef.child(`${path}${uid}/${idReq}/${fileName}`);

    return fileRef.put(textFile, metadata);

    // While the file names are the same, the references point to different files
    //console.log(mountainsRef.name,mountainImagesRef.name);
    //console.log(mountainsRef.fullPath, mountainImagesRef.fullPath);    
};

export const downloadFileURL = (path, uid, idReq, fileName) => {
    const storageRef = storage.ref();
    const fileRef = storageRef.child(`${path}${uid}/${idReq}/${fileName}`);

    return fileRef.getDownloadURL();
};


/*
export const test = () => {

    // Create a storage reference from our storage service
    var storageRef = storage.ref();

    // Create a child reference
    var imagesRef = storageRef.child("images");
    // imagesRef now points to "images"

    // Child references can also take paths delimited by "/"
    var spaceRef = storageRef.child("images/space.jpg");
    // spaceRef now points to "images/space.jpg"
    // imagesRef still points to "images"

    // Parent allows us to move to the parent of a reference
    var imagesRef = spaceRef.parent;
    // imagesRef now points to "images"

    // Root allows us to move all the way back to the top of our bucket
    var rootRef = spaceRef.root;
    // rootRef now points to the root

    // Reference"s path is: "images/space.jpg"
    // This is analogous to a file path on disk
    spaceRef.fullPath;

    // Reference"s name is the last segment of the full path: "space.jpg"
    // This is analogous to the file name
    spaceRef.name;

    // Reference"s bucket is the name of the storage bucket where files are stored
    spaceRef.bucket;

    return null;

}

*/

/*
export const fullExample = () => {

    console.log("full example");
    // Points to the root reference
    var storageRef = storage.ref();

    // Points to "images"
    var imagesRef = storageRef.child("images");

    // Points to "images/space.jpg"
    // Note that you can use variables to create child values
    var fileName = "space.jpg";
    var spaceRef = imagesRef.child(fileName);

    // File path is "images/space.jpg"
    var path = spaceRef.fullPath

    // File name is "space.jpg"
    var name = spaceRef.name

    // Points to "images"
    var imagesRef = spaceRef.parent;
    return null;
}
*/