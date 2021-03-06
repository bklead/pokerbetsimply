﻿using System;
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
        [Display(Name = "Game Id")]
        public int GameId { get; set; }
        public short? River2 { get; set; }
        public string Winner2 { get; set; }
        public short? Winning2 { get; set; }
        public short? River3 { get; set; }
        public string Winner3 { get; set; }
        public short? Winning3 { get; set; }
        public short? River4 { get; set; }
        public string Winner4 { get; set; }
        public short? Winning4 { get; set; }

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

    public class RoundAndWinner
    {
        [Required]
        public int Round { get; set; }

        [Required]
        [RegularExpression(@"(\d{2})$|(\d{2},)+(\d{2})$")]
        public string Winners { get; set; }

        public static explicit operator History(RoundAndWinner round)
        {
            return null;
        }
    }

    public class LogOnModel
    {
        [Display(Name="Role")]
        public string UserName { get; set; }

        [DataType(DataType.Password)]
        [Display(Name="Password")]
        public string Password { get; set; }    
    }

}