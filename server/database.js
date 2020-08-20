module.exports = class mDataBase{
    constructor(){
        this.data = [
            {
                id:1,
                note:"Hello world!",
            },
            {
                id:2,
                note:"Second note..."
            }
        ];
    }
    findAll(){
        return Promise.resolve(this.data);
    }
    findById(id){
        return new Promise((resolve, reject) => {
            let error=checkId(id);
            if(error){
                reject(error);
            }
            for(let elem of this.data){
                if(elem.id==id)
                    resolve(elem);
            }
            resolve(null);
        });
    }
    deleteById(id){
        return new Promise((resolve, reject) => {
            let error=checkId(id);
            if(error){
                reject(error);
            }
            for(let i=0;i<this.data.length;i++){
                if(this.data[i].id==id){
                    let elem = this.data[i];
                    this.data.splice(i,1);
                    resolve(elem);
                }
            }
            reject(new Error("Database.deleteById error - element not found."));
        });
    }
    insert(id, note){
        return new Promise((resolve, reject) => {
            if(!note){
                reject(new Error("Database.insert error - note cannot be null."));
            }else{
                let elem ={};
                elem.note=note;
                if(id){
                    if((Number.isInteger(id))&&(id>0)){
                        elem.id=id;
                        for(let element of this.data){
                            if(element.id==id)
                                elem.id=this.data[this.data.length-1].id+1;
                        }
                        this.data.push(elem);
                        resolve(elem);
                    }
                }else{
                    elem.id=1;
                    if(this.data.length!=0){
                        elem.id=this.data[this.data.length-1].id+1;
                    }
                    this.data.push(elem);
                    resolve(elem);
                }
            }
            //reject(new Error("Database.insert error - cannot insert"));
        });
    }
    updateById(id,note){
        return new Promise((resolve, reject) => {
            if(!note){
                reject(new Error("Database.update error - note cannot be null."));
            }
            let error=checkId(id);
            if(error){
                reject(error);
            }
            for(let elem of this.data){
                if(elem.id==id){
                    elem.note=note;
                    resolve(elem);
                }
            }
            reject(new Error(`Database.update error - element by this id:${id} does not exist.`));
        });
    }
}

function checkId(id){
    if(!id){
        return new Error("Database error - id cannot be null.");
    }
    if(!Number.isInteger(id)){
        return new Error("Database error - id should be integer.");
    }
    if(id<0){
        return new Error("Database error - id cannot be less than 0.");
    }
    return null;
}