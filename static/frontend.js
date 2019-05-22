tasks = new Array('Select task', 'PCA_SCREE', 'PCA_RANDOM_SAMPLING', 'PCA_STRATIFIED_SAMPLING', 'MDS_EUCLIDEAN_RANDOM_SAMPLING', 'MDS_EUCLIDEAN_STRATIFIED_SAMPLING',
    'MDS_CORRELATION_RANDOM_SAMPLING', 'MDS_CORRELATION_STRATIFIED_SAMPLING');
task_names = new Array('Select task', 'PCA Scree Plot', 'PCA Random Sampling', 'PCA Stratified Sampling', 'MDS Euclidean Random Sampling', 'MDS Euclidean Stratified Sampling',
    'MDS Correlation Random Sampling', 'MDS Correlation Stratified Sampling');

var height = 450;
var width = 500;

$(function () {
    tasks.forEach(function (t, i) {
        $('#taskList').append('<option value=' + t + '>' + task_names[i] + '</option>');
    });
});