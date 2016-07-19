import {Component} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {Routes} from "../../providers/routes/routes";
import {Camera, Transfer} from "ionic-native";
import {NgZone} from '@angular/core';
import * as _ from 'lodash';
/*
 Generated class for the AddPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    templateUrl: 'build/pages/add/add.html',
})
export class AddPage {

    base64Image:string;
    uploading: boolean = true;
    total: number;
    progress: number;

    /** Not normally mandatory but create bugs if ommited. **/
    static get parameters() {
        return [[NavController], [Routes],[Platform],[NgZone]];
    }

    constructor(private nav:NavController, private routes:Routes, private platform:Platform, private ngZone:NgZone) {
    //     platform.ready().then(() => {
    //         // Okay, so the platform is ready and our plugins are available.
    //         // Here you can do any higher level native things you might need.
    //         // console.log(navigator.device.capture)
    //     });
    }

    onClickBack() {
        this.nav.setRoot(this.routes.getPage(this.routes.VIDEOS))
    }


    getPicture() {

        Camera.getPicture({
            destinationType: Camera.DestinationType.DATA_URL,
            targetWidth: 200,
            targetHeight: 200
        }).then((imageData) => {
            this.base64Image = "data:image/jpeg;base64," + imageData;
                this.platform.ready().then(() => {
                    this.upload();
                });

        }, (error) => {
            console.log("error ", error)
        });


        //navigator.device.capture.captureVideo(captureSuccess, captureError, {limit: 1});

    }

    done = ():void => {
        this.nav.setRoot(this.routes.getPage(this.routes.VIDEOS))
    }

    success = (result:any):void => {
            this.uploading = false;
    }

    failed = (err:any):void => {
        let code = err.code;
        alert("Failed to upload image. Code: " + code);
    }

    onProgress = (progressEvent:ProgressEvent):void => {
        this.ngZone.run(() => {
            if (progressEvent.lengthComputable) {
                let progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                console.log(progress);
                this.progress = progress
            }
        });
    }

    upload1 = ():void => {
        this.platform.ready().then(() => {
            this.upload();
        });
    }

    upload = ():void => {
        let ft = new Transfer();
        let filename = _.uniqueId() + ".jpg";
        let options = {
            fileKey: 'file',
            fileName: filename,
            mimeType: 'image/jpeg',
            chunkedMode: false,
            headers: {
                'Content-Type': undefined
            },
            params: {
                fileName: filename
            }
        };
        ft.onProgress(this.onProgress);
        ft.upload(this.base64Image, "http://localhost/videos/upload", options, false)
            .then((result:any) => {
                this.success(result);
            }).catch((error:any) => {
            this.failed(error);
        });
    }


}
