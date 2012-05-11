using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;
using Domain;

namespace PokerBet.Areas.AdminPanel.Models
{
    public class GameEditModel
    {
        [Required]
        [Display(Name = "Game Id")]
        public int GameId { get; set; }

        [Required]
        [Display(Name = "River Card")]
        public short? River2 { get; set; }

        [Required]
        [Display(Name = "Winner")]
        public string Winner2 { get; set; }

        [Required]
        [Display(Name = "Winning")]
        public short? Winning2 { get; set; }

        public List<SelectListItem> Cards { get; set; }
        public List<SelectListItem> Winnings { get; set; }
        public List<SelectListItem> Winners { get; set; }
    }

    public class GamesModel
    {
        public List<GameEditModel> GameEditModel { get; set; }
        public List<SelectListItem> Games { get; set; }
        public int TotalGamesCount { get; set; }
        public int CurrentGame { get; set; }
    }

}