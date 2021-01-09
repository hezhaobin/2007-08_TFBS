#########################
# Created Sep 10th 08
# to verify the choice 
# of cutoff [-1,1] by 
# pollard's PWM
# hebin
#########################

use warnings;
use DBI;
prepareDbh();

open IN, "../Result/effect_changes.txt" ||
    die "cannot open effect_changes.txt";
$line = <IN>;
print $line;

while($line = <IN>){
    @array = ();
    @array = split(/\s+/, $line); #0,Region; 1,fpid; 2,factor; 4,coordinate; 6,ancestral; 7,evolved;
    #prepare the footprint sequence;
    $sth = $dbh->prepare(qq(select tfbs_start, tfbs_end, fp_start, fp_end, strand from tfbs where fpid = $array[1]));
    $sth->execute;
    ($tfbs_start, $tfbs_end, $fp_start, $fp_end, $strand) = $sth->fetchrow_array;
#    $ary_ref = $dbh->selectcol_arrayref(qq(select coordinate, mel from tfbs_poly
#					   where region = '$array[0]' and mel != '-' and
#					   coordinate between $fp_start-5 and $fp_end+5), {Columns=>[1,2]});
    $ary_ref = $dbh->selectcol_arrayref(qq(select coordinate, mel from tfbs_poly
					   where region = '$array[0]' and mel != '-' and
					   coordinate between $fp_start-5 and $fp_end+5 and 
					   coordinate between $tfbs_start-5 and $tfbs_end+5), {Columns=>[1,2]});
    %hash = @$ary_ref; # build hash from key_value pairs so $hash{$coordinate} => mel;
    #deal with the strand problem;
    if($strand eq '-'){
	$array[6] =~ tr/ACGT/TGCA/;
	$array[7] =~ tr/ACGT/TGCA/;
    }
    $hash{$array[4]} = $array[6]; # make the seq ancestral like;
    $anc_seq = '';
    for (sort keys %hash){
	$anc_seq = $anc_seq.$hash{$_};
    }
    $hash{$array[4]} = $array[7]; # make the seq evolved like;
    $evo_seq = '';
    for (sort keys %hash){
	$evo_seq = $evo_seq.$hash{$_};
    }
    #use patser to score the seq;
    $patser_seq = "anc\t\\$anc_seq\\\n"."evo\t\\$evo_seq\\\n";
    die "cannot open PWM file $array[2].cm" if !(-e "../OptimalPatserMatrices/PollardMatrices/$array[2].cm");
    $result = `echo -n '$patser_seq' |
    ../patser/patser -A a:t 0.3 c:g 0.2 -m ../OptimalPatserMatrices/PollardMatrices/$array[2].cm -b 1 -u2 -t -c -s`;
    $result =~ /anc\s+\S+\s+\S+\s+score=\s+(\S+)\s+/;
    $anc_score = $1;
    $result =~ /evo\s+\S+\s+\S+\s+score=\s+(\S+)\s+/;
    $evo_score = $1;
    $array[9] = int(($evo_score-$anc_score)*100)/100;
    print join("\t", @array), "\n";
}


sub prepareDbh
{
    my $username = "hebin";
    my $password = "fruitfly";
    my $database = "hebin";

    my $dsn = "DBI:mysql:$database:localhost";
    our $dbh = DBI->connect($dsn,$username,$password);
}
