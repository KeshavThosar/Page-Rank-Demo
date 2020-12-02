const rref = require('rref')
function non_zeroes_in(row){
    return row.filter((elem) => elem != 0).length
} 
function normalize(array){
    let sum = 0
    for(let i in array){
        sum += array[i]
    }
    if(typeof array === typeof {}){
        for(let prop in array){
            array[prop] /= sum 
        }
        return array
    }
    return array.map(elem => elem/sum)
}
function transpose(matrix){
    let mat_t = []
    for(let i = 0; i < matrix.length; i++){
        let temp = []
        for(let j = 0; j < matrix[i].length; j++){
            temp.push(matrix[j][i])
        }
        mat_t.push(temp)
    }
    return mat_t
}

function pageRankVector(matrix){
    A = JSON.parse(JSON.stringify(matrix))
    //[A - Iλ] = O
    for(let i = 0; i < A.length; i++) {
        A[i][i] -= 1
    }
    rref(A)
    context = {}
    //Find non-pivotal entries
    let tA = transpose(A)
    let param_index = null 
    for(let i = 0; i < tA.length; i++) {
        if(non_zeroes_in(tA[i]) > 1){
           param_index = i
           context[i] = 1
           break
        }
    }
    for (let i = 0; i < A.length; i++){
        for(let j = 0; j < A[i].length; j++){
            if(j != param_index && A[i][j] != 0){
                context[j] = -1*A[i][param_index];
                break
            }
        }
    }
    context = normalize(context)
    return context

}
module.exports.pageRankVector = pageRankVector
module.exports.transpose = transpose