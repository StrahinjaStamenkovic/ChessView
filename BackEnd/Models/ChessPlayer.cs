using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BackEnd.Models
{
    [Table("ChessPlayer")]
    public class ChessPlayer
    {
        [Key]
        [Column("ID")]
        public int ID { get; set; }

        [Column("Name")]
        [MaxLength(20)]
        [MinLength(1)]
        [DataType("varchar2")]
        public string Name { get; set; }

        [Column("LastName")]
        [MaxLength(20)]
        [MinLength(1)]
        [DataType("varchar2")]
        public string LastName { get; set; }

        [Column("Elo")]
        public int Elo { get; set; }

        [Column("Nationality")]
        [MaxLength(20)]
        [MinLength(1)]
        [DataType("varchar2")]
        public string Nationality { get; set; }

        [Column("Age")]
        public int Age { get; set; }

    }
}