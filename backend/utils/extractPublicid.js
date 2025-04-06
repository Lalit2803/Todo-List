exports.extractPublicId=(url)=>{
   

    let urlParts=url.split("/");
    let public_id=urlParts[urlParts.length-1].split(".")[0];
    let id="taskify/"+public_id;
    return id;
}