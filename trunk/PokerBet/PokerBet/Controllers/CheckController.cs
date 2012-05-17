using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using OnBarcode.Barcode;
using System.Drawing.Imaging;
using System.Drawing;
using System.Text;
using System.IO;
using PokerBet.Utilits;
using PokerBet.Models;

namespace PokerBet.Controllers
{
    public class CheckController : BaseController
    {
        public ActionResult Index()
        {
            var bets =  Unit.PokerBetSrvc.GetGameBet();
            var Model = new CheckModel()
            {
                ContractNumber = bets[0].ContractNumber,
                CurrentDate = DateTime.Now,
            };
            

            return View();
        }

        public ActionResult Barcode()
        {
            var ean13 = new Ean13("97", "85575", "50831", "8");
            Bitmap bmp = ean13.CreateBitmap();

            MemoryStream stream = new MemoryStream();
            bmp.Save(stream, ImageFormat.Png);

            return File(stream.ToArray(), "image/png");
        }

    }

}
