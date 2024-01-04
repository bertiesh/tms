export function alertMessage(that,message,msg) {
    var msg, type;
    switch (message) {
      case "success":
        type = "success";
        msg = msg;
        break;
      case "warning":
        type = "warning";
        msg = msg;
        break;
      case "error":
        type = "error";
        msg = msg;
        break;
      default:
        break;
    }
        that.$message({
            message: msg,
            type: type,
          });
  }