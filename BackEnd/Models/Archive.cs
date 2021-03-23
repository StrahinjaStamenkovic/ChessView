using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Models
{
    [Table("Archive")]
    public class Archive
    {
        [Key]
        [Column("ID")]
        public int ID { get; set; }
        public virtual List<GameInfo> Games { get; set; } = new List<GameInfo>();
    }
}