/**
 * Created by lzy on 2017/9/9.
 */
function openDeleteAccountModal(){
    $('#deleteAccountModal').modal('show', true);
}

function comfirmDeleteAccount(){
    $.get(
        '/account/deleteOne',
        function (data) {
            console.log(data.code);
            if (data.code){
                window.location.href = '/';
            }else {
                $('#deleteAccountModalBody').empty();
                $('#deleteAccountModalBody').append('<p style="color: red;">' + data.msg + '</p>');
            }
        },'json'
    )
}
