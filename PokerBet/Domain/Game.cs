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
        public string CoefficientsStep1 { get; set; }
        public string CoefficientsStep2 { get; set; }
        public string CoefficientsStep3 { get; set; }
        public string Winner1 { get; set; }
        public string Winner2 { get; set; }
        public short Winning1 { get; set; }
        public short? Winning2 { get; set; }

        [ForeignKey("Winning1")]
        public virtual Winning Winning1_base { get; set; }

        [ForeignKey("Winning2")]
        public virtual Winning Winning2_base { get; set; }
    }
}
