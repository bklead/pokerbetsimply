using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace Domain
{
    [Table("Cards")]
    public class Card
    {
        [Key]
        public short Id { get; set; }
        public string Name { get; set; }
    }
}
