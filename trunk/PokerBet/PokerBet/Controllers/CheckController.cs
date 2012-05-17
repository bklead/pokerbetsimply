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
        public ActionResult Index(int id)
        {
            var bets = Unit.PokerBetSrvc.GetGameBet(id);
            var firstBet = bets.First();

            var margin = "";
            double sum = 0;
            var eachSum = (firstBet.Sum / bets.Count()).ToString();

            for (int i = 0; i < bets.Length; i++)
			{
                sum += (firstBet.Sum / bets.Count()) * bets[i].Index;
                if (i != bets.Length - 1)
                {
                    margin += eachSum + " x " + bets[i].Index + " + ";
                }
                else
                {
                    margin += eachSum + " x " + bets[i].Index + " = " + sum;
                }
			}

            var games = new GameBet[bets.Count()];
            for (int i = 0; i < games.Count(); i++)
            {
                games[i] = new GameBet()
                {
                    Index = bets[i].Index,
                    Winner = bets[i].Winner,
                    TableNumber = bets[i].TableNumber,
                    TableCode = bets[i].TableCode,
                    Event = bets[i].Event,
                    StartDate = bets[i].StartDate
                };
            }

            var Model = new CheckModel()
            {
                ContractNumber = "978" + firstBet.ContractNumber,
                CurrentDate = DateTime.Now,
                Games = games,
                Margin = margin,
                ContractSum = firstBet.Sum,
            };


            return View(Model);
        }

        public ActionResult Barcode(string code)
        {
            var ean13 = new Ean13(code);
            Bitmap bmp = ean13.CreateBitmap();

            MemoryStream stream = new MemoryStream();
            bmp.Save(stream, ImageFormat.Png);

            return File(stream.ToArray(), "image/png");
        }

    }

}
