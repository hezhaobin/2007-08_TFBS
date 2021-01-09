############################
#! /usr/bin/perl -w
#  Created Aug 6th 2007
#  Modified Aug 27th 2007
#  To load the bs data
#  Hebin
############################


use DBI;
prepareDbh();
$dbh->do(qq{truncate table tfbs});

#die "Cannot open best_pwm_processed\n" unless open (f_input, "best_pwm_processed.txt");
die "Cannot open Footprint.GFF.txt\n" unless open (f_Input, "Footprint.GFF.txt");

<f_Input>;<f_Input>;<f_Input>;

$line = <f_Input>;
while (!eof(f_Input))
{
    ($chr_arm, $start, $end, $factor, $target, $FPID) = (split(/\s+|;|"/, $line))[0,3,4,10,15,25];
    $dbh -> do(qq{insert into tfbs
                  values
                  ($FPID, '$chr_arm', '$factor', '$target', $start, $end, NULL)});
    $line = <f_Input>;
}

if (0){
    if ($line =~ /^(\S+)\s+(\S+)\s+(\S+)/)
    {    
	my $raw_tag_id = $1;
	my $seq = $2;
	my $aln_seq = $2;
	my $count = $3;
	
	if ($raw_tag_id =~ /DME-(\S+)/)
	{$mirna = $1;}
	else
	{
	    $seq =~ s/-//g;
	    $dbh->do(qq{insert into mel_mirna_tags
			    values
			    (null, '$mirna', '$raw_tag_id', '$seq', '$aln_seq', $count)});
	}
    }
}



sub prepareDbh
{
    my $username = "hebin";
    my $password = "fruitfly";
    my $database = "hebin";

    my $dsn = "DBI:mysql:$database:localhost";
    our $dbh = DBI->connect($dsn,$username,$password);
}
