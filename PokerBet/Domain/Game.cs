using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace Domain
{
    [Table("Games")]
    public class Game
    {
        [Key]
        public int Id { get; set; }
        public short NumberOfPlayers { get; set; }
        public short Player1Card1 { get; set; }
        public short Player1Card2 { get; set; }
        public short Player2Card1 { get; set; }
        public short Player2Card2 { get; set; }
        public short Player3Card1 { get; set; }
        public short Player3Card2 { get; set; }
        public short Player4Card1 { get; set; }
        public short Player4Card2 { get; set; }
        public short? Player5Card1 { get; set; }
        public short? Player5Card2 { get; set; }
        public short? Player6Card1 { get; set; }
        public short? Player6Card2 { get; set; }
        public short? Player7Card1 { get; set; }
        public short? Player7Card2 { get; set; }
        public short? Player8Card1 { get; set; }
        public short? Player8Card2 { get; set; }
        public short Flop1 { get; set; }
        public short Flop2 { get; set; }
        public short Flop3 { get; set; }
        public short Turn { get; set; }
        public short? River1 { get; set; }
        public short? River2 { get; set; }
        public short? River3 { get; set; }
        public short? River4 { get; set; }
        public short? River5 { get; set; }
        public short? River6 { get; set; }
        public short? River7 { get; set; }
        public short? River8 { get; set; }
        public string CoefficientsStep1 { get; set; }
        public string CoefficientsStep2 { get; set; }
        public string CoefficientsStep3 { get; set; }
        public short WinnerNumber { get; set; }
        public short Winning { get; set; }

        [ForeignKey("Winning")]
        public virtual Winning Winning_base { get; set; }
    }
}
