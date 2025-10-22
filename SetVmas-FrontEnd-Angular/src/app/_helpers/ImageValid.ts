import { FormGroup, FormControl } from '@angular/forms';


// custom validator to check that two fields match
export function ImageValid(uploadName: string) {
  
  return (control: FormControl) => {

   
    var loading = false;
    var width = 0;
    var heigth = 0;

    if (uploadName == 'fileUploadImageDesktop') {
      width= 1170;
      heigth = 166;
    }
    else if (uploadName == 'fileUploadImageMovil') {
      width = 322;
      heigth = 166;
    }
    else {
    width = 292;
    heigth = 186;
  }
   
    if (control.value != null)
    {
      var img = new Image();
      img.src = control.value;

      img.onload = function () {
        if (!loading && (img.naturalHeight !== heigth || img.naturalWidth !== width)) {
          control.setErrors({ imageValid: true });
          return {
            imageValid: true
          };
        } else {
          control.setErrors(null);
        }

        loading = true;
       
      };
    }
    return null;

}
}
