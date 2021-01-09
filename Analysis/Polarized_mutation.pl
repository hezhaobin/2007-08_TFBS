#################################
# perl Polarized_mutations.pl
# Created Dec 26th 07
# To polarize the substitutions
# within binding sites
# Modified Jan 8th 07
# To solve the bug of not 
# considering which strand (+/-)
# the feature is on
# hebin
#! /usr/bin/perl -W
#################################

################################################################################
# fpid factor region chr_arm coordinate pos species ancestral evolved direction
################################################################################

open f_Output, ">../Result/polarized_mutations2" ||
    die "Cannot open file";
print f_Output "region\tfpid\tfactor\tstrand\tscore\tcoordinate\tpos\tspecies\tancestral\tevolved\tchange\n";


## loading pwm ##
open f_Input, "../OptimalPatserMatrices/weight_matrix.txt" ||
    die "Cannot open weight_matrix.txt";
while(!eof(f_Input)){
    $line = <f_Input>;
    $line =~ /Matrices\/(\S+)\"\:\ (\d+)/;
    $factor = $1; $width = $2;
    (@$factor) = ();
    <f_Input>;
    for($i = 0; $i < $width; $i ++){
	$line = <f_Input>;
	(@array) = ();
	@array = split(/\s+/, $line);
	$array[0] ne '' || shift(@array);#discard the first empty element;
	push(@$factor, @array);
    }
    #print "$factor uploaded\n";
    <f_Input>;
}
close(f_Input);

## driving table: tfbs ##
use DBI;
prepareDbh();

$sth = $dbh->prepare(qq(SELECT fpid, factor,region, tfbs_start, tfbs_end, tfbs_score, strand
			FROM tfbs 
			WHERE tfbs_score is not NULL));
$sth->execute;
(@array) = (); #0:fpid; 1:factor; 2:region; 3:tfbs_start; 4:tfbs_end; 5:score; 6:strand;
while(@array = $sth->fetchrow_array){
    $factor = $array[1];
    $region = $array[2];
    $strand = $array[6];
    $sth2 = $dbh->prepare(qq(SELECT coordinate, mel, sim_allele, yak, allele_number
			     FROM tfbs_poly
			     WHERE region = '$region' AND coordinate between $array[3] and $array[4] AND
			           polytype = 'nt' AND poly_Or_not = 'div'));
    $sth2->execute;
    $sth2->bind_columns(\$coordinate, \$mel, \$sim, \$yak, \$allele_no);
    while($sth2->fetch){
	#solve the ancestral state using parsimony;
	$species = ''; $ancestor = ''; $evolved = ''; $change = '';
	if($yak ne $mel && $yak ne $sim){
	    $ancestor = "NA";
	    $species = 'NA';
	    $evolved = 'NA';
	    $change = 'NA';
	    $p = 'NA';
	}else{
	    $anc=$ancestor = $yak;
	    $species = $yak eq $mel ? 'sim':'mel';
	    $evo=$evolved = $yak eq $mel ? $sim:$mel;
	    # evaluate direction of changes;
	    if($strand eq '+'){
		$p = $coordinate - $array[3];
		$anc =~ tr/ACGT/0123/;
		$evo =~ tr/ACGT/0123/;
	    }elsif($strand eq '-'){
		$p = $array[4] - $coordinate;
		$anc =~ tr/ACGT/3210/;
		$evo =~ tr/ACGT/3210/;
	    }else{
		die "$fpid\n";
	    }
	    $change = $$factor[4*$p+$evo] - $$factor[4*$p+$anc];
	    #print "$array[0]\t$array[1]\t$strand\t$array[3]\t$array[4]\t$p\t$coordinate\t$ancestor\t$evolved\t$change\n";
	    #print "nt\tA\tC\tG\tT\n";
	    #$a = 0;
	    while($$factor[4*$a] ne '' && 0){
		print "$a";
		for($i = 0; $i < 4; $i ++){
		    print "\t$$factor[4*$a+$i]";
		}
		print "\n";
		$a ++;
	    }
	    #getc();
	    print f_Output "$region\t$array[0]\t$array[1]\t$array[6]\t$array[5]\t$coordinate\t$p\t$species\t$ancestor\t$evolved\t$change\n";
	}
    }
    $sth2->finish;
}
$sth->finish;
$dbh->disconnect;
sub prepareDbh
{
    my $username = "hebin";
    my $password = "fruitfly";
    my $database = "hebin";

    my $dsn = "DBI:mysql:$database:localhost";
    our $dbh = DBI->connect($dsn,$username,$password);
}
