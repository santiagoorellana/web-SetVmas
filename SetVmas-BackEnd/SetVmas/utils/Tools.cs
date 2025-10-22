using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using MimeKit;
using MimeKit.Text;
using MimeKit.Utils;
using Newtonsoft.Json;
using SetVmas.ViewModels;

namespace SetVmas.utils
{
    public abstract class Tools
    {

        private static Random rng = new Random();
        public static bool EnviarCorreo(string mailTo, string mailFrom, string subject, string body, string host, string port, string userMail, string passMail,string securityMail, string PrivacyNote, string Remitente)
        {
          
            try
            {
                body += "<br><hr><br>" + PrivacyNote;
                var message = new MimeMessage();

                message.To.Add(new MailboxAddress(mailTo));
                message.From.Add(new MailboxAddress(Remitente, mailFrom));
                
                message.Subject = subject;
                //We will say we are sending HTML. But there are options for plaintext etc. 
                message.Body = new TextPart(TextFormat.Html)
                {
                    Text = body
                };


                //Be careful that the SmtpClient class is the one from Mailkit not the framework!
                using (var emailClient = new MailKit.Net.Smtp.SmtpClient())
                {
                    emailClient.ServerCertificateValidationCallback = (s, c, h, e) => true;
                    //The last parameter here is to use SSL (Which you should!)
                    //  emailClient.Connect("smtp.gmail.com", 465, MailKit.Security.SecureSocketOptions.SslOnConnect);
                    emailClient.Timeout = 120000;
                    if (securityMail=="Ninguno")
                        emailClient.Connect(host, int.Parse(port), MailKit.Security.SecureSocketOptions.None);
                    else if (securityMail == "Ssl")
                        emailClient.Connect(host, int.Parse(port), MailKit.Security.SecureSocketOptions.SslOnConnect);
                    else if (securityMail == "Tsl")
                        emailClient.Connect(host, int.Parse(port), MailKit.Security.SecureSocketOptions.StartTls);
                    else if (securityMail == "Auto")
                        emailClient.Connect(host, int.Parse(port), MailKit.Security.SecureSocketOptions.Auto);

    

                    //Remove any OAuth functionality as we won't be using it. 
                    //  emailClient.AuthenticationMechanisms.Remove("XOAUTH2");

                    emailClient.Authenticate(userMail, passMail);
                    /**AGREGADO PARA  EVITAR ENVIO DE CORREOS COMO SPAM**/
                    foreach (var part in message.BodyParts.OfType<TextPart>())
                        part.ContentTransferEncoding = ContentEncoding.QuotedPrintable;
                    message.MessageId = MimeUtils.GenerateMessageId("efferenthealthllc.onmicrosoft.com");
                    foreach (var part in message.BodyParts.OfType<TextPart>())
                        part.ContentId = null;
                    /** FIN **/

                    emailClient.Send(message);

                    emailClient.Disconnect(true);
                }
                return true;
            }
            catch (Exception ex)
            {

                return false;

            }

        }


        public static List<FormasDePagoViewModel> FormasDePago()
        {
            List<FormasDePagoViewModel> lista = new List<FormasDePagoViewModel>();
            lista.Add(new FormasDePagoViewModel(1, "Transferencia Bancaria"));
            lista.Add(new FormasDePagoViewModel(2, "Transferencia de Saldo"));
            lista.Add(new FormasDePagoViewModel(3, "Contactar Directamente"));

            return lista;
        }

        public static string Encrypt(string clearText)
        {
            string EncryptionKey = "MAKV2SPBNI99212";
            byte[] clearBytes = Encoding.Unicode.GetBytes(clearText);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateEncryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(clearBytes, 0, clearBytes.Length);
                        cs.Close();
                    }
                    clearText = Convert.ToBase64String(ms.ToArray());
                }
            }
            return clearText;
        }
        public static string Decrypt(string cipherText)
        {
            string EncryptionKey = "MAKV2SPBNI99212";
            cipherText = cipherText.Replace(" ", "+");
            byte[] cipherBytes = Convert.FromBase64String(cipherText);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateDecryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(cipherBytes, 0, cipherBytes.Length);
                        cs.Close();
                    }
                    cipherText = Encoding.Unicode.GetString(ms.ToArray());
                }
            }
            return cipherText;
        }

        public static bool SaveImages(string ImageContent, string ImageName, string path)
        {
            bool result = false;

            try
            {
                string content = ImageContent.Substring(ImageContent.LastIndexOf(',') + 1);
                byte[] bytes = Convert.FromBase64String(content);
                string file = Path.Combine(path, ImageName);
                if (bytes.Length > 0)
                {
                    Directory.CreateDirectory(path);

                    using (var stream = new FileStream(file, FileMode.OpenOrCreate))
                    {
                        stream.Write(bytes, 0, bytes.Length);
                        stream.Flush();
                    }
                }
                result = true;
            }
            catch (Exception e)
            {
                string message = e.Message;
            }

            return result;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="ImageContent"></param>
        /// <param name="ImageName"></param>
        /// <param name="path"></param>
        /// <param name="height"></param>
        /// <param name="width"></param>
        /// <param name="Girar"> Para saber cuanto es necesario girar la imagen para que este en el sentido correcto</param>
        /// <returns></returns>
        public static bool RedimensionAndSaveImages(string ImageContent, string ImageName, string path, int height, int width, int Girar = 1)
        {
            bool result = false;
            try
            {
                string content = ImageContent.Substring(ImageContent.LastIndexOf(',') + 1);
                byte[] bytes = Convert.FromBase64String(content);
                string file = Path.Combine(path, ImageName);
                if (bytes.Length > 0)
                {
                    using (MemoryStream stream = new MemoryStream(bytes))
                    {
                       /* Image img = Image.FromStream(stream);
                        int h = img.Height;
                        int w = img.Width;
                        int newW = (w * height) / h;*/

                        Image img = Image.FromStream(stream);
                        decimal M1 = img.Height;
                        decimal N1 = img.Width;
                        decimal R = N1 / M1;
                        //height = 173;
                        int newW = int.Parse(decimal.Ceiling(R * height).ToString());

                        if (4 < Girar && Girar < 9)
                        {
                            var wi = newW;
                            newW = height;
                            height = wi;
                        }
                        

                        var RotateFlip = RotateFlipType.RotateNoneFlipNone;
                        switch (Girar)
                        {
                            case 1:
                                {
                                    RotateFlip = RotateFlipType.RotateNoneFlipNone;
                                    break;
                                }
                            case 3:
                                {
                                    RotateFlip = RotateFlipType.RotateNoneFlipXY;
                                    break;
                                }
                            case 6:
                                {
                                    RotateFlip = RotateFlipType.Rotate90FlipNone;
                                    break;
                                }
                            case 8:
                                {
                                    RotateFlip = RotateFlipType.Rotate270FlipNone;
                                    break;
                                }

                        }
                        img.RotateFlip(RotateFlip);
                        Bitmap newImg = new Bitmap(img, newW, height);

                        
                        Directory.CreateDirectory(path);

                        if (newW > width)
                        {
                            Rectangle rectOrig = new Rectangle((newW - width) /2, 0, width, height);
                            Bitmap bmp = new Bitmap(rectOrig.Width, rectOrig.Height);
                            Graphics g = Graphics.FromImage(bmp);
                            g.DrawImage(newImg, 0, 0, rectOrig, GraphicsUnit.Pixel);
                            using (var aux = new FileStream(file, FileMode.Create))
                            {
                                bmp.Save(aux, ImageFormat.Jpeg);
                                aux.Flush();
                            }
                           
                        }
                        else
                        {
                            Graphics g = Graphics.FromImage(newImg);
                            g.DrawImage(img, 0, 0, newImg.Width, newImg.Height);
                            using (var aux = new FileStream(file, FileMode.Create))
                            {
                                newImg.Save(aux, ImageFormat.Jpeg);
                                aux.Flush();
                            }
                        }
                        stream.Flush();
                    }
                }
                result = true;
            }
            catch (Exception e)
            {
                string message = e.Message;
            }

            return result;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="ImageContent"></param>
        /// <param name="ImageName"></param>
        /// <param name="path"></param>
        /// <param name="height"></param>
        /// <param name="width"></param>
        /// <param name="Girar"> Para saber cuanto es necesario girar la imagen para que este en el sentido correcto</param>
        /// <returns></returns>
        public static bool RedimensionAndSaveImages2(string ImageContent, string ImageName, string path, int height, int width, int Girar=1)
        {
            bool result = false;
            try
            {
                string content = ImageContent.Substring(ImageContent.LastIndexOf(',') + 1);
                byte[] bytes = Convert.FromBase64String(content);
                string file = Path.Combine(path, ImageName);
                if (bytes.Length > 0)
                {
                    using (MemoryStream stream = new MemoryStream(bytes))
                    {
                        Image img = Image.FromStream(stream);
                        decimal M1 = img.Height;
                        decimal N1 = img.Width;
                        decimal R = N1 / M1;
                        int h = height;
                        int w = int.Parse(decimal.Ceiling(R * h).ToString());
                       /* if (img.Height >= 540)
                        {
                            h = img.Height;
                            w = (img.Width * height) / h;
                        }*/

                        if (4 < Girar && Girar < 9)
                        {
                            var wi = w;
                            w = h;
                            h = wi;
                        }

                        var RotateFlip= RotateFlipType.RotateNoneFlipNone;
                        switch (Girar)
                        {
                            case 1:
                                {
                                    RotateFlip = RotateFlipType.RotateNoneFlipNone;
                                    break;
                                }
                            case 3:
                                {
                                    RotateFlip = RotateFlipType.RotateNoneFlipXY;
                                    break;
                                }
                            case 6:
                                {
                                    RotateFlip = RotateFlipType.Rotate90FlipNone;
                                    break;
                                }
                            case 8:
                                {
                                    RotateFlip = RotateFlipType.Rotate270FlipNone;
                                    break;
                                }

                        }

                        img.RotateFlip(RotateFlip);
                          
                        Bitmap newImg = new Bitmap(img, w, h);

                        Directory.CreateDirectory(path);

                            Graphics g = Graphics.FromImage(newImg);
                            g.DrawImage(img, 0, 0, newImg.Width, newImg.Height);
                            using (var aux = new FileStream(file, FileMode.Create))
                            {
                                newImg.Save(aux, ImageFormat.Jpeg);
                                aux.Flush();
                            }
                     
                        stream.Flush();
                    }
                }
                result = true;
            }
            catch (Exception e)
            {
                string message = e.Message;
            }

            return result;
        }



        public static bool SaveBannerInferior(string ImageName, string pathAnuncio, string pathBanner, int height, int width)
        {
            bool result = false;
            try
            {
                string fileA = Path.Combine(pathAnuncio, ImageName);
                string fileB = Path.Combine(pathBanner, ImageName);
                Image img = Image.FromFile(fileA);
                int h = img.Height;
                int w = img.Width;
                int newW = (w * height) / h;
                Bitmap newImg = new Bitmap(img, newW, height);

                Directory.CreateDirectory(pathBanner);

                if (newW > width)
                {
                    Rectangle rectOrig = new Rectangle((newW - width) / 2, 0, width, height);
                    Bitmap bmp = new Bitmap(rectOrig.Width, rectOrig.Height);
                    Graphics g = Graphics.FromImage(bmp);
                    g.DrawImage(newImg, 0, 0, rectOrig, GraphicsUnit.Pixel);
                    using (var aux = new FileStream(fileB, FileMode.OpenOrCreate))
                    {
                        bmp.Save(aux, ImageFormat.Jpeg);
                        aux.Flush();
                    }

                }
                else
                {
                    Graphics g = Graphics.FromImage(newImg);
                    g.DrawImage(img, 0, 0, newImg.Width, newImg.Height);
                    using (var aux = new FileStream(fileB, FileMode.OpenOrCreate))
                    {
                        newImg.Save(aux, ImageFormat.Jpeg);
                        aux.Flush();
                    }
                }

                result = true;
            }
            catch (Exception e)
            {
                string message = e.Message;
            }

            return result;
        }

        public static void croptoSquare(string ImageName, string pathAnuncio, string pathBanner, int height, int width)
        {
            //Location of 320x240 image
            string fileA = Path.Combine(pathAnuncio, ImageName);
            string fileB = Path.Combine(pathBanner, ImageName);

            Image img = Image.FromFile(fileA);
            int h = img.Height;
            int w = img.Width;

            //if (h>w)
            //{
            //    w = (w * height) / h;
            //}
            //else
            //    h = (h * width) / w;



            var scale = Math.Max(width / img.Width, height / img.Height);
            // get the top left position of the image
            var x = (width / 2) - (img.Width / 2) * scale;
            var y = (height / 2) - (img.Height / 2) * scale;
           // ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

            // Create a new image at the cropped size
            Bitmap cropped = new Bitmap(width, height);

            //Load image from file
            //using (Image image = Image.FromFile(fileA))
            {
                // Create a Graphics object to do the drawing, *with the new bitmap as the target*
                using (Graphics g = Graphics.FromImage(cropped))
                {
                    // Draw the desired area of the original into the graphics object
                    // g.DrawImage(img, new Rectangle(0, 0, x, y), new Rectangle(40, 0, width, height), GraphicsUnit.Pixel);
                    if(scale != 0)
                    g.DrawImage(img, x, y, img.Width * scale, img.Height * scale);
                    else
                    g.DrawImage(img, 0,0,285, 150);
                    // Save the result
                    cropped.Save(fileB);
                }
            }
        }


        public static string GenerarNombre(string name)
        {
            string[] names=name.Split('.', 2);
            //return names[0] + rng.Next(10, 10000).ToString()+"."+ names[1];
            var nameImage = Guid.NewGuid() + "."+ names[1];
            return nameImage;
        }

        public static void DeleteImagen(string ImageName, string path)
        {
            string file = Path.Combine(path, ImageName);

            if (File.Exists(file))
            {
                File.Delete(file);
            }
        }

        public static bool ExistImagen(string ImageName, string path)
        {
            string file = Path.Combine(path, ImageName);

            if (File.Exists(file))
            {
                return true;
            }
            return false;
        }


        public static List<T> Shuffle<T>(List<T> list)
        {
            int n = list.Count;
            while (n > 1)
            {
                n--;
                int k = rng.Next(n + 1);
                T value = list[k];
                list[k] = list[n];
                list[n] = value;
            }

            return list;
        }

        public static bool VerificarCaptcha(string captcha)
        {
            string secretKey = "6LfI1fcUAAAAALqv4o0n0EiFQ1c420PhDdBLasi3";//Setvmas.com
           // string secretKey = "6LdX0fcUAAAAALdLh4x96JZrcr_0dHYsJ-4nttm7";//localhost
            var client = new WebClient();
            // get captcha verification result
            var verificationResultJson = client.DownloadString(string.Format
            ("https://www.google.com/recaptcha/api/siteverify?secret={0}&response={1}",
            secretKey, captcha));
            // convert json to object
            var verificationResult = JsonConvert.DeserializeObject<CaptchaVerificationResult>(verificationResultJson);
            //Process verification result
            if (!verificationResult.Success)
            {
                return false;
            }
            else
            {
                return true;

            }
        }

    }
}
