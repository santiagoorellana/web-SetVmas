import { Component, Inject, Output, EventEmitter, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'my-foo',
    templateUrl: './fileUpload.html',
    styleUrls: ['./fileUpload.css']

  })
  export class FileUploadComponent {
    urlImg: any = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
  name: string = "";
      disableComponent:boolean = false;
  fileData: File = null;
      editing:boolean = false;
  srcOrientation: number= 1;

    @Input() idAttrFileUpload = "";

    @Input() idImg = "";

    @Output() addEvent: EventEmitter<any> = new EventEmitter();
    @Output() deleteEvent: EventEmitter<any> = new EventEmitter();
    @Output() errorSizeEvent: EventEmitter<any> = new EventEmitter();



  constructor(@Inject(DOCUMENT) private document: Document, public toastr: ToastrService) { }

  addNew(): void{
      this.addEvent.emit();
  }

  deleteFileUpload():void{
    this.fileData = null;
    this.deleteEvent.emit();
  }

    onOpenFileUpload(): void {
        this.document.getElementById(this.idAttrFileUpload).click();
      }

      fileProgress(fileInput: any) {
        this.fileData = <File>fileInput.target.files[0];
        /*const index = this.idAttrFileUpload.split("_")[1];
        if(this.srcOrientation.length === +index){
          this.srcOrientation.push(1);
        }*/
        this.srcOrientation =1;
        if(this.fileData) {

          this.preview(this.srcOrientation);
        }

      }

  preview(srcO) {
    this.editing = false;
    this.name = this.fileData.name;

    this.idAttrFileUpload = this.idAttrFileUpload + '_' + this.name;

        // Show preview
        let mimeType = this.fileData.type;
        if (mimeType.match(/image\/*/) == null) {
          return;
        }
    var size = this.fileData.size / 1024;
    if (size > 4096) {
      this.errorSizeEvent.emit();
    }
    else {
      this.readImage(174, 130, this.idImg, srcO);
    }



      }



readImage(width, height, id, srcO): any {
    const reader = new FileReader();
    reader.readAsDataURL(this.fileData);

    const This =  this;
    reader.onload = (_event) => {

        let image = new Image();

        image.onload = function () {
            let canvas = document.createElement("canvas");
           //  var canvas = <HTMLCanvasElement>document.getElementById("micanvas5");
            let context = canvas.getContext("2d");
            canvas.width = width;
            canvas.height = height;
            // context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);

            var scale = Math.min(canvas.width / image.width, canvas.height / image.height);
            // get the top left position of the image
            var x = (canvas.width / 2) - (image.width / 2) * scale;
            var y = (canvas.height / 2) - (image.height / 2) * scale;


          // set proper canvas dimensions before transform & export
          if (4 < srcO && srcO < 9) {
            canvas.width = height;
            canvas.height = width;
          } else {
            canvas.width = width;
            canvas.height = height;
          }

          // transform context before drawing image
          switch (srcO) {
            case 2: context.transform(-1, 0, 0, 1, width, 0); break;
            case 3: context.transform(-1, 0, 0, -1, width, height ); break;
            case 4: context.transform(1, 0, 0, -1, 0, height ); break;
            case 5: context.transform(0, 1, 1, 0, 0, 0); break;
            case 6: context.transform(0, 1, -1, 0, height , 0); break;
            case 7: context.transform(0, -1, -1, 0, height , width); break;
            case 8: context.transform(0, -1, 1, 0, 0, width); break;
            default: break;
          }

            context.drawImage(image, x, y, image.width * scale, image.height * scale);
            document.getElementById(id).setAttribute('src',  canvas.toDataURL());
           // This.urlImg = image.src; //canvas.toDataURL();
        };


        image.src = reader.result.toString();
        this.urlImg =  image.src;

        };
      }

  girar() {

    if (this.fileData) {
      if (this.srcOrientation === 1) {
        this.srcOrientation = 6;
        this.preview(this.srcOrientation);

      } else
      if (this.srcOrientation === 6) {
        this.srcOrientation = 3;
        this.preview( this.srcOrientation);
      } else
      if (this.srcOrientation === 3) {
        this.srcOrientation = 8;
        this.preview( this.srcOrientation);
      } else
      if (this.srcOrientation === 8) {
        this.srcOrientation = 1;
        this.preview( this.srcOrientation);
      }
    }

  }



  }
