const populate_model = (model, models) => {
    let out = {};
    if("properties" in model) {
        let props = Object.keys(model.properties);
        props.forEach(prop => {
        if("$ref" in model.properties[prop]) {
            let refArr = model.properties[prop].$ref.split('/')
            let ref_model = models.find(elem => elem.name === refArr[refArr.length - 1])
            Object.assign(out, {[prop]: populate_model(ref_model, models)});
        }
        else if("type" in model.properties[prop]) {
            if(model.properties[prop].type === "array") {
                let arr = [];
                if("type" in model.properties[prop].items) {
                    arr.push(populateByType(model.properties[prop].items));
                    Object.assign(out, {[prop]: arr});
                } else if("$ref" in model.properties[prop].items) {
                    let refArr = model.properties[prop].items.$ref.split('/')
                    let ref_model = models.find(elem => elem.name === refArr[refArr.length - 1])
                    arr.push(populate_model(ref_model, models))
                    Object.assign(out, {[prop]: arr});
                }
            } else Object.assign(out, {[prop]: populateByType(model.properties[prop])});
        }
        })
    } else if ("additionalProperties" in model) {
        let prop_value = populateByType(model.additionalProperties)
        let sample_obj = {
            "additionalProp1" : prop_value,
            "additionalProp2" : prop_value,
            "additionalProp3" : prop_value,
        }
        Object.assign(out, sample_obj);
    }
    return out;
}

const populateByType = (item) => {
    let example = item.example;
    let _enum = item.enum;
    let format = item.format;
    let type = item.type;
    if(example !== undefined) return example;
    if(_enum !== undefined) return _enum[0];
    if(type === "integer") return 0;
    if(type === "string") {
        if(format === "date-time") return (new Date).toISOString();
        else return type
    }
    if(type === "boolean") return true;
}

export default populate_model;